"use client";

import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { SPECIALTIES, US_STATES, CONFERENCES } from "@/lib/constants";

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
  const hasFilters = specialty || state || conference;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-48">
        <Select
          label="Specialty"
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          options={SPECIALTIES.map((s) => ({ value: s, label: s }))}
          placeholder="All specialties"
        />
      </div>
      <div className="w-40">
        <Select
          label="State"
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          options={US_STATES.map((s) => ({ value: s.value, label: s.label }))}
          placeholder="All states"
        />
      </div>
      <div className="w-40">
        <Select
          label="Conference"
          value={conference}
          onChange={(e) => onConferenceChange(e.target.value)}
          options={CONFERENCES.map((c) => ({ value: c.name, label: c.name }))}
          placeholder="All conferences"
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
