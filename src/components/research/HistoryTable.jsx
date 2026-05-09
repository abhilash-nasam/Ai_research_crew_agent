import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, Download, Trash2, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const statusColors = {
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-destructive/10 text-destructive border-destructive/20',
    planning: 'bg-primary/10 text-primary border-primary/20',
    researching: 'bg-primary/10 text-primary border-primary/20',
    summarizing: 'bg-accent/10 text-accent border-accent/20',
    generating_pdf: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export default function HistoryTable({ reports, onView }) {
    const queryClient = useQueryClient();

    const handleDelete = async (id) => {
        await base44.entities.Report.delete(id);
        queryClient.invalidateQueries({ queryKey: ['reports'] });
    };

    if (!reports || reports.length === 0) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No reports generated yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Enter a topic above to get started</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden"
        >
            <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Research History
                </h3>
            </div>

            <div className="divide-y divide-border/30">
                {reports.map((report, index) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-white/[0.02] transition-colors group"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <button
                                    onClick={() => onView(report)}
                                    className="font-medium text-foreground hover:text-primary transition-colors text-left truncate block w-full"
                                >
                                    {report.topic}
                                </button>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <Badge variant="outline" className={statusColors[report.status] || statusColors.completed}>
                                        {report.status || 'completed'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(report.created_date), 'MMM d, yyyy · h:mm a')}
                                    </span>
                                    {report.duration_seconds && (
                                        <span className="text-xs text-muted-foreground">
                                            {report.duration_seconds}s
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {report.pdf_url && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.open(report.pdf_url, '_blank')}
                                        className="text-muted-foreground hover:text-primary h-8 w-8"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onView(report)}
                                    className="text-muted-foreground hover:text-primary h-8 w-8"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(report.id)}
                                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}