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
import { useLanguage } from "@/components/providers/LanguageProvider";

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

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conferences, setConferences] = useState<ConferenceOption[]>([]);

  const steps = [
    t.register.stepAccount,
    t.register.stepIdentity,
    t.register.stepProfessional,
    t.register.stepLocation,
    t.register.stepConferences,
  ];

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
        if (!formData.email) return t.register.emailRequired;
        if (!/\S+@\S+\.\S+/.test(formData.email)) return t.register.invalidEmail;
        if (formData.password.length < 6) return t.register.passwordMinLength;
        if (formData.password !== formData.confirmPassword) return t.register.passwordsNoMatch;
        return null;
      case 1:
        if (!formData.firstName) return t.register.firstNameRequired;
        if (!formData.lastName) return t.register.lastNameRequired;
        if (!formData.npiNumber) return t.register.npiRequired;
        if (!validateNPI(formData.npiNumber)) return t.register.npiInvalidError;
        return null;
      case 2:
        if (!formData.specialty) return t.register.specialtyRequired;
        return null;
      case 3:
        if (!formData.city) return t.register.cityRequired;
        if (!formData.state) return t.register.stateRequired;
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
        setError(data.error || t.register.registrationFailed);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError(t.register.somethingWrong);
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
                i < currentStep ? "text-primary-400" : i === currentStep ? "text-primary-500" : "text-text-light"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
        <div className="h-2.5 rounded-full bg-border">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-text-primary">
        {currentStep === 0 && t.register.createAccount}
        {currentStep === 1 && t.register.yourIdentity}
        {currentStep === 2 && t.register.professionalDetails}
        {currentStep === 3 && t.register.practiceLocation}
        {currentStep === 4 && t.register.conferenceAffiliations}
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
            label={t.register.emailAddress}
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder={t.register.emailPlaceholder}
          />
          <Input
            label={t.register.password}
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder={t.register.passwordPlaceholder}
          />
          <Input
            label={t.register.confirmPassword}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder={t.register.confirmPlaceholder}
          />
        </div>
      )}

      {/* Step 1: Identity */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.register.firstName}
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder={t.register.firstNamePlaceholder}
            />
            <Input
              label={t.register.lastName}
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder={t.register.lastNamePlaceholder}
            />
          </div>
          <Input
            label={t.register.npiNumber}
            value={formData.npiNumber}
            onChange={(e) => updateField("npiNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={t.register.npiPlaceholder}
            helperText={t.register.npiHelper}
            error={npiValid === false ? t.register.npiInvalid : undefined}
          />
          {npiValid === true && (
            <p className="text-xs text-success font-medium">{t.register.npiValid}</p>
          )}
        </div>
      )}

      {/* Step 2: Professional */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <Select
            label={t.register.specialty}
            value={formData.specialty}
            onChange={(e) => updateField("specialty", e.target.value)}
            options={SPECIALTIES.map((s) => ({ value: s, label: s }))}
            placeholder={t.register.selectSpecialty}
          />
          <Select
            label={t.register.subSpecialty}
            value={formData.subSpecialty}
            onChange={(e) => updateField("subSpecialty", e.target.value)}
            options={SUB_SPECIALTIES.map((s) => ({ value: s, label: s }))}
            placeholder={t.register.selectSubSpecialty}
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.boardCertified}
                onChange={(e) => updateField("boardCertified", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-400"
              />
              {t.register.boardCertified}
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fellowshipTrained}
                onChange={(e) => updateField("fellowshipTrained", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary-500 focus:ring-primary-400"
              />
              {t.register.fellowshipTrained}
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Input
            label={t.register.practiceNameOptional}
            value={formData.practiceName}
            onChange={(e) => updateField("practiceName", e.target.value)}
            placeholder={t.register.practiceNamePlaceholder}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.register.city}
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder={t.register.cityPlaceholder}
            />
            <Select
              label={t.register.state}
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              options={US_STATES.map((s) => ({ value: s.value, label: s.label }))}
              placeholder={t.register.selectState}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.register.zipOptional}
              value={formData.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder={t.register.zipPlaceholder}
            />
            <Input
              label={t.register.phoneOptional}
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder={t.register.phonePlaceholder}
            />
          </div>
        </div>
      )}

      {/* Step 4: Conferences */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            {t.register.selectConferencesOptional}
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
            {t.register.back}
          </Button>
        ) : (
          <div />
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>{t.register.next}</Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={loading}>
            {t.register.completeRegistration}
          </Button>
        )}
      </div>

      {currentStep === 0 && (
        <p className="mt-6 text-center text-sm text-text-muted">
          {t.register.haveAccount}{" "}
          <Link href="/login" className="font-medium text-primary-500 hover:text-primary-600">
            {t.register.signIn}
          </Link>
        </p>
      )}
    </Card>
  );
}
