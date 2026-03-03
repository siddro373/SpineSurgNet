"use client";

import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { SPECIALTIES, US_STATES, CONFERENCES } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SurgeonFiltersProps {
  specialty: string;
  state: string;
  conference: string;
  onSpecialtyChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onConferenceChange: (value: string) => void;
  onClear: () => void;
}

export default function SurgeonFilters({
  specialty,
  state,
  conference,
  onSpecialtyChange,
  onStateChange,
  onConferenceChange,
  onClear,
}: SurgeonFiltersProps) {
  const { t } = useLanguage();
  const hasFilters = specialty || state || conference;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-48">
        <Select
          label={t.filters.specialty}
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          options={SPECIALTIES.map((s) => ({ value: s, label: s }))}
          placeholder={t.filters.allSpecialties}
        />
      </div>
      <div className="w-40">
        <Select
          label={t.filters.state}
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          options={US_STATES.map((s) => ({ value: s.value, label: s.label }))}
          placeholder={t.filters.allStates}
        />
      </div>
      <div className="w-40">
        <Select
          label={t.filters.conference}
          value={conference}
          onChange={(e) => onConferenceChange(e.target.value)}
          options={CONFERENCES.map((c) => ({ value: c.name, label: c.name }))}
          placeholder={t.filters.allConferences}
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t.filters.clearFilters}
        </Button>
      )}
    </div>
  );
}
