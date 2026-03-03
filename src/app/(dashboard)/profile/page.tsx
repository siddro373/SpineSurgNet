"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Avatar from "@/components/ui/Avatar";
import { SPECIALTIES, SUB_SPECIALTIES, US_STATES, CONFERENCE_ROLES } from "@/lib/constants";
import { Camera, UserCircle, Shield, AlertTriangle, Eye } from "lucide-react";

interface ConferenceOption {
  id: string;
  name: string;
  fullName: string;
}

interface SelectedConference {
  conferenceId: string;
  name: string;
  role: string;
}

const tabs = [
  { key: "profile", label: "Profile Info", icon: UserCircle },
  { key: "security", label: "Security", icon: Shield },
  { key: "danger", label: "Danger Zone", icon: AlertTriangle },
];

function ProfileContent() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile form state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [conferences, setConferences] = useState<ConferenceOption[]>([]);
  const [selectedConferences, setSelectedConferences] = useState<SelectedConference[]>([]);
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

  // Security - Email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Security - Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Danger - Delete
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const surgeonId = session?.user?.surgeonId;

  // Fetch profile data
  useEffect(() => {
    if (!surgeonId) {
      if (session) setLoading(false);
      return;
    }
    Promise.all([
      fetch(`/api/surgeons/${surgeonId}`).then((r) => r.json()),
      fetch("/api/conferences").then((r) => r.json()),
    ])
      .then(([data, conferencesData]) => {
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
        setConferences(conferencesData);
        if (data.conferences) {
          setSelectedConferences(
            data.conferences.map((c: { conferenceId: string; conference: { name: string }; role?: string | null }) => ({
              conferenceId: c.conferenceId,
              name: c.conference.name,
              role: c.role || "Attendee",
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [surgeonId, session]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  }, [router]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleConference = (conf: ConferenceOption) => {
    setSelectedConferences((prev) => {
      const exists = prev.find((c) => c.conferenceId === conf.id);
      if (exists) return prev.filter((c) => c.conferenceId !== conf.id);
      return [...prev, { conferenceId: conf.id, name: conf.name, role: "Attendee" }];
    });
  };

  const updateConferenceRole = (conferenceId: string, role: string) => {
    setSelectedConferences((prev) =>
      prev.map((c) => (c.conferenceId === conferenceId ? { ...c, role } : c))
    );
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setProfileError("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/user/upload-avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.error || "Failed to upload image"); return; }
      setProfileImageUrl(data.profileImageUrl);
    } catch {
      setProfileError("Failed to upload image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...formData };
      if (payload.yearsInPractice) {
        payload.yearsInPractice = parseInt(payload.yearsInPractice as string);
      } else {
        delete payload.yearsInPractice;
      }
      payload.conferences = selectedConferences.map((c) => ({
        conferenceId: c.conferenceId,
        role: c.role,
      }));
      const res = await fetch(`/api/surgeons/${surgeonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setProfileError(data.error || "Failed to update profile");
        return;
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      setProfileError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setEmailLoading(true);
    try {
      const res = await fetch("/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setEmailError(data.error || "Failed to update email"); return; }
      setEmailSuccess("Email updated successfully");
      await updateSession({ email: newEmail });
      setNewEmail("");
      setEmailPassword("");
    } catch {
      setEmailError("Something went wrong");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) { setPasswordError("New passwords do not match"); return; }
    if (newPassword.length < 6) { setPasswordError("New password must be at least 6 characters"); return; }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.error || "Failed to update password"); return; }
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");
    if (deleteConfirm !== "DELETE") { setDeleteError("Please type DELETE to confirm"); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword, confirmText: deleteConfirm }),
      });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.error || "Failed to delete account"); return; }
      signOut({ callbackUrl: "/login" });
    } catch {
      setDeleteError("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (!surgeonId) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No surgeon profile found. Please complete registration.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">My Account</h1>
        <Link href={`/surgeon/${surgeonId}`}>
          <Button variant="secondary" size="sm">
            <Eye className="h-4 w-4 mr-1" /> View Public Profile
          </Button>
        </Link>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "text-primary-400 border-primary-500"
                : "text-text-muted border-transparent hover:text-text-secondary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== PROFILE INFO TAB ==================== */}
      {activeTab === "profile" && (
        <div>
          {/* Cover banner + avatar */}
          <div className="rounded-2xl overflow-hidden border border-border bg-surface-light mb-6">
            <div className="h-28 bg-gradient-to-br from-primary-500/30 via-primary-600/20 to-secondary-400/30" />
            <div className="px-6 pb-5">
              <div className="flex items-end gap-4 -mt-10">
                <div className="relative">
                  <Avatar
                    src={profileImageUrl}
                    name={`${formData.firstName} ${formData.lastName}`}
                    size="xl"
                    className="ring-4 ring-surface-light shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-secondary-700 shadow-md hover:bg-primary-600 transition-colors disabled:opacity-50"
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
                <div className="pb-1">
                  <p className="text-lg font-bold text-text-primary">
                    Dr. {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-text-muted">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {profileError && (
            <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{profileError}</div>
          )}
          {profileSuccess && (
            <div className="mb-4 rounded-md bg-success-light p-3 text-sm text-success">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleProfileSave}>
            <Card className="mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="First Name" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
                  <Input label="Last Name" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Professional Details</h2>
              <div className="space-y-4">
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
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Practice Location</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input label="City" value={formData.city} onChange={(e) => updateField("city", e.target.value)} required />
                  <Select label="State" value={formData.state} onChange={(e) => updateField("state", e.target.value)} options={US_STATES.map((s) => ({ value: s.value, label: s.label }))} placeholder="Select" />
                  <Input label="ZIP Code" value={formData.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
                </div>
                <Input label="Phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-3">Conference Affiliations</h2>
              <p className="text-xs text-text-muted mb-3">Select conferences you attend or are affiliated with:</p>
              <div className="space-y-2">
                {conferences.map((conf) => {
                  const isSelected = selectedConferences.some((c) => c.conferenceId === conf.id);
                  const selected = selectedConferences.find((c) => c.conferenceId === conf.id);
                  return (
                    <div key={conf.id} className="rounded-lg border border-border p-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleConference(conf)}
                          className="mt-0.5 h-4 w-4 rounded border-border text-primary-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary text-sm">{conf.name}</span>
                            <span className="text-xs text-text-muted">{conf.fullName}</span>
                          </div>
                          {isSelected && (
                            <select
                              value={selected?.role || "Attendee"}
                              onChange={(e) => updateConferenceRole(conf.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 h-8 rounded border border-border bg-surface-white px-2 text-xs text-text-secondary"
                            >
                              {CONFERENCE_ROLES.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" isLoading={saving}>Save Changes</Button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== SECURITY TAB ==================== */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Email */}
          <Card>
            <h2 className="text-lg font-bold text-text-primary mb-4">Change Email</h2>
            <p className="text-sm text-text-muted mb-4">
              Current email: <span className="font-medium text-text-secondary">{session?.user?.email}</span>
            </p>

            {emailError && <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{emailError}</div>}
            {emailSuccess && <div className="mb-4 rounded-md bg-success-light p-3 text-sm text-success">{emailSuccess}</div>}

            <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
              <Input
                label="New Email Address"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@hospital.com"
                required
              />
              <Input
                label="Current Password"
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                helperText="Required to verify your identity"
                required
              />
              <Button type="submit" isLoading={emailLoading}>Update Email</Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <h2 className="text-lg font-bold text-text-primary mb-4">Change Password</h2>

            {passwordError && <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{passwordError}</div>}
            {passwordSuccess && <div className="mb-4 rounded-md bg-success-light p-3 text-sm text-success">{passwordSuccess}</div>}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Must be at least 6 characters"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" isLoading={passwordLoading}>Update Password</Button>
            </form>
          </Card>
        </div>
      )}

      {/* ==================== DANGER ZONE TAB ==================== */}
      {activeTab === "danger" && (
        <div>
          <Card className="border-error/30">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-error" />
              <h2 className="text-lg font-bold text-error">Delete Account</h2>
            </div>
            <p className="text-sm text-text-muted mb-4">
              This action is permanent and cannot be undone. All your data including your surgeon profile,
              conference affiliations, and account information will be permanently deleted.
            </p>

            {deleteError && <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">{deleteError}</div>}

            <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
              <Input
                label="Your Password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                helperText="Enter your password to confirm your identity"
                required
              />
              <Input
                label='Type "DELETE" to confirm'
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                required
              />
              <Button
                type="submit"
                isLoading={deleteLoading}
                className="!bg-error hover:!bg-red-600 !shadow-none"
              >
                Permanently Delete Account
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
