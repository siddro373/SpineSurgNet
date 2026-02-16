import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
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
      <Card padding="compact" className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-4">
          <Avatar
            name={`${surgeon.firstName} ${surgeon.lastName}`}
            src={surgeon.profileImageUrl}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate">
              Dr. {surgeon.firstName} {surgeon.lastName}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">{surgeon.specialty}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
              <MapPin className="h-3 w-3" />
              {surgeon.city}, {surgeon.state}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {surgeon.boardCertified && <Badge variant="green">Board Certified</Badge>}
              {surgeon.fellowshipTrained && <Badge variant="purple">Fellowship</Badge>}
              {surgeon.conferences?.slice(0, 3).map((c) => (
                <Badge key={c.conference.name} variant="blue">{c.conference.name}</Badge>
              ))}
              {(surgeon.conferences?.length || 0) > 3 && (
                <Badge variant="gray">+{(surgeon.conferences?.length || 0) - 3}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
