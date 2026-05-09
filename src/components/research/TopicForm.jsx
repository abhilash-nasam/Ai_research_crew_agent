import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SUGGESTIONS = [
  'Artificial Intelligence in Healthcare',
  'Climate Change Solutions 2025',
  'Future of Remote Work',
  'Quantum Computing Applications',
  'Sustainable Energy Innovation',
  'Cybersecurity Threats & Trends',
];

export default function TopicForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Hero Section */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-muted-foreground mb-6"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Multi-Agent Autonomous Research System</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">AI Research</span>
          <br />
          <span className="text-foreground">Crew Agent</span>
        </h1>
        
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enter any topic and our multi-agent system will autonomously research, 
          analyze, and generate a professional PDF report.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="glass rounded-2xl p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 pl-4">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your research topic..."
              className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl px-6 font-semibold transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Researching</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Generate Report</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Lightbulb className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-1">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full glass-light text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}