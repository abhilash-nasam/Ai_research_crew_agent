import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Globe, FileText, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 'Manager Agent', label: 'Planning', icon: Brain, description: 'Creating execution plan' },
  { id: 'Research Agent', label: 'Researching', icon: Globe, description: 'Searching the web' },
  { id: 'Summarizer Agent', label: 'Analyzing', icon: FileText, description: 'Synthesizing findings' },
  { id: 'Report Agent', label: 'Generating', icon: Download, description: 'Building PDF report' },
];

function StepIcon({ step, currentStep, logs }) {
  const stepLogs = logs.filter(l => l.agent === step.id);
  const lastLog = stepLogs[stepLogs.length - 1];
  const Icon = step.icon;
  
  const isActive = currentStep === step.id;
  const isCompleted = lastLog?.status === 'completed' || lastLog?.status === 'warning';
  const isFailed = lastLog?.status === 'failed';

  if (isFailed) {
    return <AlertCircle className="w-5 h-5 text-destructive" />;
  }
  if (isCompleted) {
    return <CheckCircle2 className="w-5 h-5 text-green-400" />;
  }
  if (isActive) {
    return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
  }
  return <Icon className="w-5 h-5 text-muted-foreground/40" />;
}

export default function ProgressTracker({ currentStep, logs = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-semibold text-foreground">Agent Workflow Progress</h3>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[22px] top-10 bottom-10 w-px bg-border" />

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const stepLogs = logs.filter(l => l.agent === step.id);
              const lastLog = stepLogs[stepLogs.length - 1];
              const isActive = currentStep === step.id;
              const isCompleted = lastLog?.status === 'completed' || lastLog?.status === 'warning';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 relative ${
                    isActive ? '' : isCompleted ? 'opacity-80' : 'opacity-40'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${
                    isActive ? 'glass pulse-glow' : isCompleted ? 'bg-green-500/10 border border-green-500/20' : 'glass-light'
                  }`}>
                    <StepIcon step={step} currentStep={currentStep} logs={logs} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{step.label}</span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {lastLog?.action || step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live log feed */}
        <AnimatePresence>
          {logs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-6 pt-4 border-t border-border/50"
            >
              <p className="text-xs text-muted-foreground font-mono mb-2">Agent Logs</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-mono flex items-center gap-2"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      log.status === 'completed' ? 'bg-green-400' :
                      log.status === 'failed' ? 'bg-destructive' :
                      log.status === 'warning' ? 'bg-yellow-400' :
                      'bg-primary'
                    }`} />
                    <span className="text-muted-foreground">[{log.agent}]</span>
                    <span className="text-foreground/70 truncate">{log.action}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}