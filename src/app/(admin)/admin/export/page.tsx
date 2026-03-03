"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ExportPage() {
  const { t } = useLanguage();

  const handleExport = () => {
    window.location.href = "/api/admin/export";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Download className="h-7 w-7 text-primary-500" />
        {t.admin.exportTitle}
      </h1>

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/15 shrink-0">
            <FileSpreadsheet className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">{t.admin.surgeonDbExport}</h2>
            <p className="text-sm text-text-muted mt-1">
              {t.admin.exportDescription}
            </p>
            <div className="mt-3 text-xs text-text-light">
              <p>{t.admin.exportFields}</p>
            </div>
            <Button onClick={handleExport} className="mt-4">
              <Download className="h-4 w-4 mr-2" /> {t.admin.downloadCSV}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 border-primary-500/30 bg-primary-500/10">
        <h3 className="font-semibold text-text-primary mb-2">{t.admin.forUlrich}</h3>
        <p className="text-sm text-text-muted">
          {t.admin.ulrichExportNote}
        </p>
      </Card>
    </div>
  );
}
