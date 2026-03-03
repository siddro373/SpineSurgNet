"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Database, Download, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminSurgeonsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", String(page));
    params.set("limit", "20");

    fetch(`/api/surgeons?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSurgeons(data.data || []);
        setTotalPages(data.totalPages || 0);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  useEffect(() => setPage(1), [debouncedSearch]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t.admin.allSurgeons}
          </h1>
          <p className="text-sm text-text-muted mt-1">{total} {t.admin.registeredSurgeons}</p>
        </div>
        <a href="/api/admin/export" download>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
          </Button>
        </a>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-border">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t.admin.searchPlaceholder}
            className="max-w-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-light">
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.name}</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.npi}</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.specialty}</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.location}</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.conferences}</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {surgeons.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-light">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      Dr. {s.firstName} {s.lastName}
                    </td>
                    <td className="px-4 py-3 text-text-muted font-mono text-xs">{s.npiNumber}</td>
                    <td className="px-4 py-3 text-text-secondary">{s.specialty}</td>
                    <td className="px-4 py-3 text-text-muted">{s.city}, {s.state}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.conferences?.map((c: any) => (
                          <Badge key={c.id} variant="blue">{c.conference.name}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/surgeon/${s.id}`} className="text-primary-500 hover:text-primary-600">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
