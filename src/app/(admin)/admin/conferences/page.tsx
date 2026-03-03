"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { BookOpen, Plus, Trash2 } from "lucide-react";

interface Conference {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  website: string | null;
  _count: { surgeons: number };
}

export default function ConferenceManagementPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    description: "",
    website: "",
  });

  const fetchConferences = () => {
    fetch("/api/admin/conferences")
      .then((r) => r.json())
      .then(setConferences)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/conferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create conference");
        return;
      }

      setSuccess("Conference created successfully");
      setFormData({ name: "", fullName: "", description: "", website: "" });
      setShowForm(false);
      fetchConferences();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove all surgeon affiliations with this conference.`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/conferences", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete conference");
        return;
      }

      fetchConferences();
    } catch {
      setError("Something went wrong");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary-500" />
            Conferences
          </h1>
          <p className="text-sm text-text-muted mt-1">{conferences.length} conferences</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Conference
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-success-light p-3 text-sm text-success">{success}</div>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">New Conference</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Short Name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., NASS"
                required
              />
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="e.g., North American Spine Society"
                required
              />
            </div>
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
            />
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
              placeholder="https://..."
            />
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>Create Conference</Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-light">
                <th className="px-4 py-3 text-left font-medium text-text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Full Name</th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">Description</th>
                <th className="px-4 py-3 text-center font-medium text-text-muted">Surgeons</th>
                <th className="px-4 py-3 text-center font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {conferences.map((c) => (
                <tr key={c.id} className="hover:bg-surface-light">
                  <td className="px-4 py-3 font-medium text-primary-500">{c.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{c.fullName}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{c.description || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-500/15 text-xs font-medium text-primary-400">
                      {c._count.surgeons}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="text-text-muted hover:text-error transition-colors"
                      title="Delete conference"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {conferences.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    No conferences yet. Click &ldquo;Add Conference&rdquo; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
