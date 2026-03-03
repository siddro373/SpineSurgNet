"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import { Users, MapPin, BookOpen, Stethoscope, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [recentSurgeons, setRecentSurgeons] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    inSpecialty: 0,
    inState: 0,
    totalConferences: 0,
  });
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Surgeon";

  useEffect(() => {
    async function fetchData() {
      try {
        const [surgeonsRes, statsRes] = await Promise.all([
          fetch("/api/surgeons?limit=5&page=1"),
          fetch("/api/dashboard/stats"),
        ]);
        const surgeonsData = await surgeonsRes.json();
        const statsData = await statsRes.json();

        setRecentSurgeons(surgeonsData.data || []);
        setStats({
          total: surgeonsData.total || 0,
          inSpecialty: statsData.inSpecialty || 0,
          inState: statsData.inState || 0,
          totalConferences: statsData.totalConferences || 0,
        });
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 via-surface-light to-secondary-500 p-6 text-white shadow-lg overflow-hidden relative border border-primary-500/20">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
        <div className="relative">
          <p className="text-primary-400 text-sm font-medium">Welcome back</p>
          <h1 className="text-3xl font-bold mt-1">Dr. {userName.split(" ").pop()}</h1>
          <p className="mt-2 text-text-muted text-sm max-w-sm">
            Stay connected with the spine surgery community.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 shrink-0">
              <Users className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Total Surgeons</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-200/15 shrink-0">
              <Stethoscope className="h-6 w-6 text-secondary-200" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.inSpecialty}</p>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">In My Specialty</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 shrink-0">
              <MapPin className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.inState}</p>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">In My State</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 shrink-0">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.totalConferences}</p>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Conferences</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent surgeons */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Recently Joined</h2>
          <Link href="/directory" className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : recentSurgeons.length === 0 ? (
          <p className="text-sm text-text-muted py-4 text-center">No surgeons registered yet. Be the first!</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentSurgeons.map((surgeon) => (
              <Link key={surgeon.id} href={`/surgeon/${surgeon.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors">
                <Avatar name={`${surgeon.firstName} ${surgeon.lastName}`} src={surgeon.profileImageUrl} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    Dr. {surgeon.firstName} {surgeon.lastName}
                  </p>
                  <p className="text-xs text-text-muted">{surgeon.specialty}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Ulrich Medical CTA */}
      <Card variant="warm" className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm shrink-0">
            <span className="text-lg font-black text-white">U</span>
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Ulrich Medical USA</h3>
            <p className="text-sm text-text-muted mt-0.5">
              Explore the latest spine implant systems and surgical solutions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
