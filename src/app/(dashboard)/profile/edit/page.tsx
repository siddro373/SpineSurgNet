"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Avatar from "@/components/ui/Avatar";
import { SPECIALTIES, SUB_SPECIALTIES, US_STATES } from "@/lib/constants";
import { Camera } from "lucide-react";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    subSpecialty: "",
    boardCertified: false,
    fellowshipTrained: false,
    yearsInPractice: "",
    practiceName: "",
    hospitalAffiliation: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const surgeonId = (session?.user as any)?.surgeonId;

  useEffect(() => {
    if (!surgeonId) return;
    fetch(`/api/surgeons/${surgeonId}`)
      .then((r) => r.json())
      .then((data) => {
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          specialty: data.specialty || "",
          subSpecialty: data.subSpecialty || "",
          boardCertified: data.boardCertified || false,
          fellowshipTrained: data.fellowshipTrained || false,
          yearsInPractice: data.yearsInPractice?.toString() || "",
          practiceName: data.practiceName || "",
          hospitalAffiliation: data.hospitalAffiliation || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          phone: data.phone || "",
        });
        setProfileImageUrl(data.profileImageUrl || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [surgeonId]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload image");
        return;
      }

      setProfileImageUrl(data.profileImageUrl);
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const payload: any = { ...formData };
      if (payload.yearsInPractice) {
        payload.yearsInPractice = parseInt(payload.yearsInPractice);
      } else {
        delete payload.yearsInPractice;
      }

      const res = await fetch(`/api/surgeons/${surgeonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/surgeon/${surgeonId}`), 1000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12"><Spinner size="lg" /></div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Profile</h1>

      <Card>
        {error && (
          <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-success-light p-3 text-sm text-success">
            Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Avatar Upload */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={profileImageUrl}
              name={`${formData.firstName} ${formData.lastName}`}
              size="lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Profile Photo</p>
            <p className="text-xs text-text-muted">JPEG, PNG, or WebP. Max 5MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Specialty" value={formData.specialty} onChange={(e) => updateField("specialty", e.target.value)} options={SPECIALTIES.map((s) => ({ value: s, label: s }))} placeholder="Select specialty" />
            <Select label="Sub-specialty" value={formData.subSpecialty} onChange={(e) => updateField("subSpecialty", e.target.value)} options={SUB_SPECIALTIES.map((s) => ({ value: s, label: s }))} placeholder="Select sub-specialty" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={formData.boardCertified} onChange={(e) => updateField("boardCertified", e.target.checked)} className="h-4 w-4 rounded border-border text-primary-500" />
              Board Certified
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={formData.fellowshipTrained} onChange={(e) => updateField("fellowshipTrained", e.target.checked)} className="h-4 w-4 rounded border-border text-primary-500" />
              Fellowship Trained
            </label>
          </div>

          <Input label="Years in Practice" type="number" value={formData.yearsInPractice} onChange={(e) => updateField("yearsInPractice", e.target.value)} placeholder="e.g., 15" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Practice Name" value={formData.practiceName} onChange={(e) => updateField("practiceName", e.target.value)} />
            <Input label="Hospital Affiliation" value={formData.hospitalAffiliation} onChange={(e) => updateField("hospitalAffiliation", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" value={formData.city} onChange={(e) => updateField("city", e.target.value)} required />
            <Select label="State" value={formData.state} onChange={(e) => updateField("state", e.target.value)} options={US_STATES.map((s) => ({ value: s.value, label: s.label }))} placeholder="Select" />
            <Input label="ZIP Code" value={formData.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
          </div>

          <Input label="Phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 123-4567" />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" isLoading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
