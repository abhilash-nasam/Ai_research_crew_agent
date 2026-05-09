import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, TrendingUp, Lightbulb, AlertTriangle, 
  BookOpen, Target, ChevronDown, ChevronUp, Clock, Globe 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SECTIONS = [
  { key: 'executive_summary', title: 'Executive Summary', icon: BookOpen, color: 'text-primary' },
  { key: 'key_findings', title: 'Key Findings', icon: Target, color: 'text-green-400' },
  { key: 'current_trends', title: 'Current Trends', icon: TrendingUp, color: 'text-accent' },
  { key: 'opportunities', title: 'Opportunities', icon: Lightbulb, color: 'text-yellow-400' },
  { key: 'risks_challenges', title: 'Risks & Challenges', icon: AlertTriangle, color: 'text-destructive' },
  { key: 'conclusion', title: 'Conclusion', icon: FileText, color: 'text-primary' },
];

function SectionBlock({ section, content, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = section.icon;

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${section.color}`} />
          </div>
          <h3 className="font-semibold text-foreground text-left">{section.title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4"
        >
          <div className="prose prose-invert prose-sm max-w-none text-foreground/80 leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SummaryCard({ report }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{report.topic}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {report.duration_seconds}s
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {report.sources?.length || 0} sources
            </span>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div className="space-y-3">
        {SECTIONS.map((section, index) => (
          <SectionBlock
            key={section.key}
            section={section}
            content={report[section.key]}
            index={index}
          />
        ))}
      </div>

      {/* Sources */}
      {report.sources && report.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass rounded-xl p-4"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            References ({report.sources.length})
          </h3>
          <div className="space-y-2">
            {report.sources.slice(0, 10).map((source, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground font-mono text-xs mt-0.5">{i + 1}.</span>
                <div className="min-w-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block"
                  >
                    {source.title || source.url}
                  </a>
                  {source.snippet && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{source.snippet}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}