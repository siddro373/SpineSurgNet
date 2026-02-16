"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { MapPin, Phone, Mail, Building2, Award, Calendar, Pencil } from "lucide-react";

export default function SurgeonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [surgeon, setSurgeon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = (session?.user as any)?.surgeonId === id;

  useEffect(() => {
    fetch(`/api/surgeons/${id}`)
      .then((r) => r.json())
      .then(setSurgeon)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!surgeon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary">Surgeon not found</h2>
        <Link href="/directory" className="text-primary-500 hover:text-primary-600 text-sm mt-2 inline-block">
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar
            name={`${surgeon.firstName} ${surgeon.lastName}`}
            src={surgeon.profileImageUrl}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Dr. {surgeon.firstName} {surgeon.lastName}
                </h1>
                <p className="text-text-muted mt-1">{surgeon.specialty}</p>
                {surgeon.subSpecialty && (
                  <p className="text-sm text-text-muted">{surgeon.subSpecialty}</p>
                )}
              </div>
              {isOwnProfile && (
                <Link href="/profile/edit">
                  <Button variant="secondary" size="sm">
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {surgeon.boardCertified && <Badge variant="green">Board Certified</Badge>}
              {surgeon.fellowshipTrained && <Badge variant="purple">Fellowship Trained</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {surgeon.city}, {surgeon.state}
              </span>
              {surgeon.practiceName && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" /> {surgeon.practiceName}
                </span>
              )}
              {surgeon.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" /> {surgeon.phone}
                </span>
              )}
              {surgeon.user?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {surgeon.user.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary-500" /> Professional Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-text-muted uppercase">NPI Number</dt>
              <dd className="text-sm text-text-primary">{surgeon.npiNumber}</dd>
            </div>
            {surgeon.hospitalAffiliation && (
              <div>
                <dt className="text-xs font-medium text-text-muted uppercase">Hospital Affiliation</dt>
                <dd className="text-sm text-text-primary">{surgeon.hospitalAffiliation}</dd>
              </div>
            )}
            {surgeon.yearsInPractice && (
              <div>
                <dt className="text-xs font-medium text-text-muted uppercase">Years in Practice</dt>
                <dd className="text-sm text-text-primary">{surgeon.yearsInPractice}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" /> Conference Affiliations
          </h2>
          {surgeon.conferences?.length > 0 ? (
            <div className="space-y-2">
              {surgeon.conferences.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{c.conference.name}</p>
                    <p className="text-xs text-text-muted">{c.conference.fullName}</p>
                  </div>
                  {c.role && <Badge variant="blue">{c.role}</Badge>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No conference affiliations listed</p>
          )}
        </Card>
      </div>
    </div>
  );
}
