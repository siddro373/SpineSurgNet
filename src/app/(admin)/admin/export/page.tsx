"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ExportPage() {
  const handleExport = () => {
    window.location.href = "/api/admin/export";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Download className="h-7 w-7 text-primary-500" />
        Export Data
      </h1>

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/15 shrink-0">
            <FileSpreadsheet className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">Surgeon Database Export</h2>
            <p className="text-sm text-text-muted mt-1">
              Download a complete CSV file of all registered surgeons with their profile information,
              specialties, practice locations, and conference affiliations.
            </p>
            <div className="mt-3 text-xs text-text-light">
              <p>Included fields: Name, Email, NPI, Specialty, Sub-specialty, Board Certification,
              Fellowship Training, Practice Name, Hospital Affiliation, City, State, ZIP, Phone,
              Conference Affiliations, Registration Date</p>
            </div>
            <Button onClick={handleExport} className="mt-4">
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 border-primary-500/30 bg-primary-500/10">
        <h3 className="font-semibold text-text-primary mb-2">For Ulrich Medical USA</h3>
        <p className="text-sm text-text-muted">
          This export contains all surgeon data gathered through SpineSurgNet registration.
          Use this data for targeted outreach, event invitations (NASS, CNS, AANS, Eurospine),
          and implant system marketing campaigns.
        </p>
      </Card>
    </div>
  );
}
