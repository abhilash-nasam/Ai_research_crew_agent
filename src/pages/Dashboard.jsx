import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import TopicForm from '@/components/research/TopicForm';
import ProgressTracker from '@/components/research/ProgressTracker';
import SummaryCard from '@/components/research/SummaryCard';
import DownloadButton from '@/components/research/DownloadButton';
import HistoryTable from '@/components/research/HistoryTable';
import AgentArchitecture from '@/components/research/AgentArchitecture';
import StatsBar from '@/components/research/StatsBar';
import { runResearchCrew } from '@/lib/researchAgents';
import { generateAndUploadPDF } from '@/lib/pdfGenerator';

export default function Dashboard() {
  const [isResearching, setIsResearching] = useState(false);
  const [progress, setProgress] = useState({ logs: [], currentStep: null });
  const [currentReport, setCurrentReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date', 50),
  });

  const handleResearch = useCallback(async (topic) => {
    setIsResearching(true);
    setCurrentReport(null);
    setViewingReport(null);
    setProgress({ logs: [], currentStep: null });

    // Create initial report record
    const reportRecord = await base44.entities.Report.create({
      topic,
      status: 'planning',
    });

    const onProgress = ({ logs, currentStep }) => {
      setProgress({ logs, currentStep });
      // Update status based on current step
      const statusMap = {
        'Manager Agent': 'planning',
        'Research Agent': 'researching',
        'Summarizer Agent': 'summarizing',
        'Report Agent': 'generating_pdf',
      };
      if (statusMap[currentStep]) {
        base44.entities.Report.update(reportRecord.id, { status: statusMap[currentStep] });
      }
    };

    try {
      const result = await runResearchCrew(topic, onProgress);

      // Generate PDF
      const pdfUrl = await generateAndUploadPDF(result);

      // Save completed report
      const updatedReport = {
        ...result,
        pdf_url: pdfUrl,
        status: 'completed',
      };
      await base44.entities.Report.update(reportRecord.id, updatedReport);

      setCurrentReport({ ...updatedReport, id: reportRecord.id, created_date: reportRecord.created_date });
      queryClient.invalidateQueries({ queryKey: ['reports'] });

      toast({
        title: 'Research Complete',
        description: `Report on "${topic}" generated successfully.`,
      });
    } catch (err) {
      await base44.entities.Report.update(reportRecord.id, {
        status: 'failed',
        error_message: err.message,
      });
      queryClient.invalidateQueries({ queryKey: ['reports'] });

      toast({
        title: 'Research Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsResearching(false);
    }
  }, [queryClient, toast]);

  const handleViewReport = (report) => {
    setViewingReport(report);
    setCurrentReport(null);
  };

  const reportToShow = viewingReport || currentReport;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Show report view */}
        <AnimatePresence mode="wait">
          {reportToShow && reportToShow.status === 'completed' ? (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="ghost"
                  onClick={() => { setViewingReport(null); setCurrentReport(null); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <DownloadButton report={reportToShow} />
              </div>
              <SummaryCard report={reportToShow} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Topic Form */}
              <TopicForm onSubmit={handleResearch} isLoading={isResearching} />

              {/* Agent Architecture */}
              {!isResearching && !currentReport && (
                <AgentArchitecture />
              )}

              {/* Progress Tracker */}
              {isResearching && (
                <ProgressTracker
                  currentStep={progress.currentStep}
                  logs={progress.logs}
                />
              )}

              {/* Stats & History */}
              {reports.length > 0 && !isResearching && (
                <div className="space-y-6">
                  <StatsBar reports={reports.filter(r => r.status === 'completed')} />
                  <HistoryTable reports={reports} onView={handleViewReport} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <Sparkles className="w-3 h-3" />
            <span>AI Research Crew Agent — Multi-Agent Autonomous System</span>
          </div>
        </div>
      </div>
    </div>
  );
}