"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SPECIALTIES, SUB_SPECIALTIES, US_STATES, CONFERENCE_ROLES } from "@/lib/constants";
import { validateNPI } from "@/lib/npi";

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

const steps = [
  "Account",
  "Identity",
  "Professional",
  "Location",
  "Conferences",
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conferences, setConferences] = useState<ConferenceOption[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    npiNumber: "",
    specialty: "",
    subSpecialty: "",
    boardCertified: false,
    fellowshipTrained: false,
    city: "",
    state: "",
    zipCode: "",
    practiceName: "",
    phone: "",
  });

  const [selectedConferences, setSelectedConferences] = useState<SelectedConference[]>([]);
  const [npiValid, setNpiValid] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/conferences")
      .then((r) => r.json())
      .then((data) => setConferences(data))
      .catch(() => {});
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "npiNumber") {
      setNpiValid(value.length === 10 ? validateNPI(value) : null);
    }
  };

  const toggleConference = (conf: ConferenceOption) => {
    setSelectedConferences((prev) => {
      const exists = prev.find((c) => c.conferenceId === conf.id);
      if (exists) {
        return prev.filter((c) => c.conferenceId !== conf.id);
      }
      return [...prev, { conferenceId: conf.id, name: conf.name, role: "Attendee" }];
    });
  };

  const updateConferenceRole = (conferenceId: string, role: string) => {
    setSelectedConferences((prev) =>
      prev.map((c) => (c.conferenceId === conferenceId ? { ...c, role } : c))
    );
  };

  const validateStep = (): string | null => {
    switch (currentStep) {
      case 0:
        if (!formData.email) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
        if (formData.password.length < 6) return "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match";
        return null;
      case 1:
        if (!formData.firstName) return "First name is required";
        if (!formData.lastName) return "Last name is required";
        if (!formData.npiNumber) return "NPI number is required";
        if (!validateNPI(formData.npiNumber)) return "Invalid NPI number";
        return null;
      case 2:
        if (!formData.specialty) return "Specialty is required";
        return null;
      case 3:
        if (!formData.city) return "City is required";
        if (!formData.state) return "State is required";
        return null;
      case 4:
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          conferences: selectedConferences.map((c) => ({
            conferenceId: c.conferenceId,
            role: c.role,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((step, i) => (
            <span
              key={step}
              className={`text-xs font-medium ${
                i <= currentStep ? "text-primary-500" : "text-text-light"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-surface">
          <div
            className="h-2 rounded-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        {currentStep === 0 && "Create Your Account"}
        {currentStep === 1 && "Your Identity"}
        {currentStep === 2 && "Professional Details"}
        {currentStep === 3 && "Practice Location"}
        {currentStep === 4 && "Conference Affiliations"}
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Step 0: Account */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@hospital.com"
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
      )}

      {/* Step 1: Identity */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="John"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Smith"
            />
          </div>
          <Input
            label="NPI Number"
            value={formData.npiNumber}
            onChange={(e) => updateField("npiNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit NPI number"
            helperText="Your National Provider Identifier"
            error={npiValid === false ? "Invalid NPI number" : undefined}
          />
          {npiValid === true && (
            <p className="text-xs text-success font-medium">Valid NPI number</p>
          )}
        </div>
      )}

      {/* Step 2: Professional */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <Select
            label="Specialty"
            value={formData.specialty}
            onChange={(e) => updateField("specialty", e.target.value)}
            options={SPECIALTIES.map((s) => ({ value: s, label: s }))}
            placeholder="Select your specialty"
          />
          <Select
            label="Sub-specialty (Optional)"
            value={formData.subSpecialty}
            onChange={(e) => updateField("subSpecialty", e.target.value)}
            options={SUB_SPECIALTIES.map((s) => ({ value: s, label: s }))}
            placeholder="Select sub-specialty"
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.boardCertified}
                onChange={(e) => updateField("boardCertified", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-400"
              />
              Board Certified
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fellowshipTrained}
                onChange={(e) => updateField("fellowshipTrained", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-400"
              />
              Fellowship Trained
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Input
            label="Practice Name (Optional)"
            value={formData.practiceName}
            onChange={(e) => updateField("practiceName", e.target.value)}
            placeholder="e.g., Texas Spine & Scoliosis"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Houston"
            />
            <Select
              label="State"
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              options={US_STATES.map((s) => ({ value: s.value, label: s.label }))}
              placeholder="Select state"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code (Optional)"
              value={formData.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="77001"
            />
            <Input
              label="Phone (Optional)"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      )}

      {/* Step 4: Conferences */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Select conferences you attend or are affiliated with (optional):
          </p>
          <div className="space-y-3">
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
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-400"
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
                          className="mt-2 h-8 rounded border border-border bg-white px-2 text-xs text-text-secondary"
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
          {selectedConferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedConferences.map((c) => (
                <Badge key={c.conferenceId} variant="blue">
                  {c.name} - {c.role}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        {currentStep > 0 ? (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={loading}>
            Complete Registration
          </Button>
        )}
      </div>

      {currentStep === 0 && (
        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary-500 hover:text-primary-600">
            Sign in
          </Link>
        </p>
      )}
    </Card>
  );
}
