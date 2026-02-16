"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { LayoutDashboard, Users, MapPin, TrendingUp, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [recentSurgeons, setRecentSurgeons] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, inSpecialty: 0, inState: 0 });
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "Surgeon";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/surgeons?limit=5&page=1");
        const data = await res.json();
        setRecentSurgeons(data.data || []);
        setStats((prev) => ({ ...prev, total: data.total || 0 }));
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome banner */}
      <Card className="mb-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white border-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Dr. {userName.split(" ").pop()}</h1>
            <p className="mt-1 text-primary-100">
              Connect with spine surgeons and explore the latest in spine implant technology.
            </p>
          </div>
          <LayoutDashboard className="h-12 w-12 text-primary-200 hidden sm:block" />
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Users className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Total Surgeons</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{recentSurgeons.length}</p>
              <p className="text-xs text-text-muted">Recently Joined</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <MapPin className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">8</p>
              <p className="text-xs text-text-muted">Conferences Tracked</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent surgeons */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recently Joined</h2>
          <Link href="/directory" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : recentSurgeons.length === 0 ? (
          <p className="text-sm text-text-muted py-4 text-center">No surgeons registered yet. Be the first!</p>
        ) : (
          <div className="divide-y divide-border">
            {recentSurgeons.map((surgeon) => (
              <Link key={surgeon.id} href={`/surgeon/${surgeon.id}`} className="flex items-center gap-3 py-3 hover:bg-surface-light -mx-6 px-6 transition-colors">
                <Avatar name={`${surgeon.firstName} ${surgeon.lastName}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    Dr. {surgeon.firstName} {surgeon.lastName}
                  </p>
                  <p className="text-xs text-text-muted">{surgeon.specialty}</p>
                </div>
                <span className="text-xs text-text-light">{surgeon.city}, {surgeon.state}</span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Ulrich Medical CTA */}
      <Card className="mt-6 border-primary-200 bg-primary-50">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 shrink-0">
            <span className="text-lg font-bold text-white">U</span>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Ulrich Medical USA</h3>
            <p className="text-sm text-text-muted mt-0.5">
              Explore the latest spine implant systems and surgical solutions. Stay informed about upcoming events and product demonstrations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
