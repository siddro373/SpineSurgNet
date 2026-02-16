"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const surgeonId = (session?.user as any)?.surgeonId;
    if (surgeonId) {
      router.replace(`/surgeon/${surgeonId}`);
    } else if (session) {
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-text-muted">No surgeon profile found.</p>
    </div>
  );
}
