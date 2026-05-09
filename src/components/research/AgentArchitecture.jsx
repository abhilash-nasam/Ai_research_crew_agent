import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Globe, FileText, Download, ArrowRight } from 'lucide-react';

const agents = [
  { icon: Brain, name: 'Manager', desc: 'Plans workflow', color: 'from-primary to-blue-400' },
  { icon: Globe, name: 'Research', desc: 'Web search', color: 'from-blue-400 to-accent' },
  { icon: FileText, name: 'Summarizer', desc: 'Analysis', color: 'from-accent to-purple-400' },
  { icon: Download, name: 'Report', desc: 'PDF output', color: 'from-purple-400 to-pink-400' },
];

export default function AgentArchitecture() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6">
      {agents.map((agent, i) => (
        <React.Fragment key={agent.name}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}>
              <agent.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">{agent.name}</p>
              <p className="text-[10px] text-muted-foreground">{agent.desc}</p>
            </div>
          </motion.div>
          {i < agents.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.1 }}
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}