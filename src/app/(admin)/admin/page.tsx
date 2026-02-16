"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { Users, TrendingUp, BarChart3, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-primary-500" />
        Admin Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Users className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats?.totalSurgeons || 0}</p>
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
              <p className="text-2xl font-bold text-text-primary">{stats?.newThisWeek || 0}</p>
              <p className="text-xs text-text-muted">New This Week</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats?.newThisMonth || 0}</p>
              <p className="text-xs text-text-muted">New This Month</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats?.bySpecialty?.length || 0}</p>
              <p className="text-xs text-text-muted">Specialties</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Specialty */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Surgeons by Specialty</h2>
          {stats?.bySpecialty?.length > 0 ? (
            <div className="space-y-3">
              {stats.bySpecialty.map((item: any) => (
                <div key={item.specialty} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary truncate flex-1">{item.specialty}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="w-24 h-2 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${(item.count / stats.totalSurgeons) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No data yet</p>
          )}
        </Card>

        {/* By State */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Top States</h2>
          {stats?.byState?.length > 0 ? (
            <div className="space-y-3">
              {stats.byState.slice(0, 10).map((item: any) => (
                <div key={item.state} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{item.state}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${(item.count / stats.totalSurgeons) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No data yet</p>
          )}
        </Card>

        {/* By Conference */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Conference Affiliations</h2>
          {stats?.byConference?.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.byConference.map((item: any) => (
                <div key={item.name} className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-primary-500">{item.count}</p>
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No data yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
