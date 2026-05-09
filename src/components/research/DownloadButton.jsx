import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAndUploadPDF } from '@/lib/pdfGenerator';
import { base44 } from '@/api/base44Client';

export default function DownloadButton({ report }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    // If already has a PDF URL, download directly
    if (report.pdf_url) {
      window.open(report.pdf_url, '_blank');
      return;
    }

    setGenerating(true);
    const pdfUrl = await generateAndUploadPDF(report);
    
    // Save URL to report
    await base44.entities.Report.update(report.id, { pdf_url: pdfUrl });
    
    setGenerating(false);
    setDone(true);
    window.open(pdfUrl, '_blank');
    
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        onClick={handleDownload}
        disabled={generating}
        size="lg"
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl px-8 py-6 font-semibold text-base shadow-lg shadow-primary/20 transition-all"
      >
        {generating ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating PDF...</span>
          </div>
        ) : done ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Downloaded!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Download PDF Report</span>
            <FileText className="w-4 h-4 opacity-60" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}