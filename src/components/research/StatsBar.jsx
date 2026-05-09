import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Globe, Zap } from 'lucide-react';

export default function StatsBar({ reports }) {
  const totalReports = reports.length;
  const totalTime = reports.reduce((sum, r) => sum + (r.duration_seconds || 0), 0);
  const avgTime = totalReports > 0 ? Math.round(totalTime / totalReports) : 0;
  const totalSources = reports.reduce((sum, r) => sum + (r.sources?.length || 0), 0);

  const stats = [
    { label: 'Reports Generated', value: totalReports, icon: FileText, color: 'text-primary' },
    { label: 'Avg. Research Time', value: `${avgTime}s`, icon: Clock, color: 'text-accent' },
    { label: 'Total Sources', value: totalSources, icon: Globe, color: 'text-green-400' },
    { label: 'Agents Used', value: '4', icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}