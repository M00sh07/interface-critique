import { AlertTriangle, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '@/types/critique';
import { SeverityBadge } from './SeverityBadge';

interface AnalysisSummaryProps {
  result: AnalysisResult;
}

export function AnalysisSummary({ result }: AnalysisSummaryProps) {
  const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
  const moderateCount = result.issues.filter(i => i.severity === 'moderate').length;
  const minorCount = result.issues.filter(i => i.severity === 'minor').length;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Summary Text */}
      <div>
        <p className="text-sm text-foreground leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Issue Counts */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-severity-critical" />
          <span className="text-sm">
            <span className="font-semibold">{criticalCount}</span>
            <span className="text-muted-foreground ml-1">critical</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-severity-moderate" />
          <span className="text-sm">
            <span className="font-semibold">{moderateCount}</span>
            <span className="text-muted-foreground ml-1">moderate</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-severity-minor" />
          <span className="text-sm">
            <span className="font-semibold">{minorCount}</span>
            <span className="text-muted-foreground ml-1">minor</span>
          </span>
        </div>
      </div>

      {/* Top Priority */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 text-severity-critical mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            If you fix only one thing, fix this
          </span>
        </div>
        <div className="bg-card rounded-lg p-4 border border-severity-critical/20">
          <div className="flex items-center gap-2 mb-2">
            <SeverityBadge severity={result.topPriority.severity} />
          </div>
          <p className="text-sm font-medium mb-2">{result.topPriority.observation}</p>
          <p className="text-sm text-muted-foreground">{result.topPriority.suggestion}</p>
        </div>
      </div>

      {/* Improvement Direction */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 text-primary mb-3">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Improvement Direction
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.improvementDirection}
        </p>
      </div>
    </div>
  );
}
