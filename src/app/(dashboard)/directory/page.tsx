"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SurgeonCard from "@/components/surgeon/SurgeonCard";
import SurgeonFilters from "@/components/surgeon/SurgeonFilters";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { Users } from "lucide-react";

function DirectoryContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [conference, setConference] = useState(searchParams.get("conference") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  const fetchSurgeons = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (specialty) params.set("specialty", specialty);
    if (state) params.set("state", state);
    if (conference) params.set("conference", conference);
    params.set("page", String(page));
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/surgeons?${params}`);
      const data = await res.json();
      setSurgeons(data.data || []);
      setTotalPages(data.totalPages || 0);
      setTotal(data.total || 0);
    } catch {
      setSurgeons([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, specialty, state, conference, page]);

  useEffect(() => {
    fetchSurgeons();
  }, [fetchSurgeons]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, specialty, state, conference]);

  const clearFilters = () => {
    setSearch("");
    setSpecialty("");
    setState("");
    setConference("");
    setPage(1);
  };

  return (
    <>
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or NPI..."
          className="max-w-md"
        />
      </div>

      <div className="mb-6">
        <SurgeonFilters
          specialty={specialty}
          state={state}
          conference={conference}
          onSpecialtyChange={setSpecialty}
          onStateChange={setState}
          onConferenceChange={setConference}
          onClear={clearFilters}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : surgeons.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-text-light" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">No surgeons found</h3>
          <p className="mt-1 text-sm text-text-muted">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">{total} surgeon{total !== 1 ? "s" : ""} found</p>
          <div className="grid gap-4">
            {surgeons.map((surgeon) => (
              <SurgeonCard key={surgeon.id} surgeon={surgeon} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}

export default function DirectoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Users className="h-7 w-7 text-primary-500" />
          Surgeon Directory
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Browse and connect with spine surgeons in the network
        </p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
        <DirectoryContent />
      </Suspense>
    </div>
  );
}
