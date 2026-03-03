import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { MapPin } from "lucide-react";

interface SurgeonCardProps {
  surgeon: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    city: string;
    state: string;
    profileImageUrl?: string | null;
    boardCertified: boolean;
    fellowshipTrained: boolean;
    conferences?: {
      conference: { name: string };
      role?: string | null;
    }[];
  };
}

export default function SurgeonCard({ surgeon }: SurgeonCardProps) {
  return (
    <Link href={`/surgeon/${surgeon.id}`}>
      <div className="group bg-surface-light rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-border-dark transition-all duration-300 overflow-hidden cursor-pointer">
        {/* Photo header */}
        <div className="relative h-32 bg-gradient-to-br from-primary-500/20 via-primary-600/15 to-secondary-400/20 flex items-center justify-center">
          {surgeon.profileImageUrl ? (
            <img
              src={surgeon.profileImageUrl}
              alt={`${surgeon.firstName} ${surgeon.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-white/80 shadow-sm">
              <span className="text-2xl font-bold text-primary-400">
                {surgeon.firstName[0]}{surgeon.lastName[0]}
              </span>
            </div>
          )}
          {/* Credential badges overlaid */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {surgeon.boardCertified && (
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                Board Certified
              </span>
            )}
            {surgeon.fellowshipTrained && (
              <span className="rounded-full bg-secondary-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                Fellowship
              </span>
            )}
          </div>
        </div>
        {/* Card body */}
        <div className="p-4">
          <h3 className="font-bold text-text-primary text-base leading-tight">
            Dr. {surgeon.firstName} {surgeon.lastName}
          </h3>
          <p className="text-sm text-primary-400 font-medium mt-0.5">{surgeon.specialty}</p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
            <MapPin className="h-3 w-3 shrink-0" />
            {surgeon.city}, {surgeon.state}
          </div>
          {surgeon.conferences && surgeon.conferences.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {surgeon.conferences.slice(0, 2).map((c) => (
                <Badge key={c.conference.name} variant="blue">{c.conference.name}</Badge>
              ))}
              {surgeon.conferences.length > 2 && (
                <Badge variant="gray">+{surgeon.conferences.length - 2}</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
