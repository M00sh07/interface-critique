import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CritiqueIssue } from '@/types/critique';
import { CritiqueCard } from './CritiqueCard';

interface AnnotatedOverlayProps {
  imageUrl: string;
  issues: CritiqueIssue[];
  activeIssueId: string | null;
  onIssueSelect: (id: string | null) => void;
}

export function AnnotatedOverlay({ 
  imageUrl, 
  issues, 
  activeIssueId,
  onIssueSelect 
}: AnnotatedOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const activeIssue = issues.find(i => i.id === activeIssueId);

  return (
    <div className="relative w-full h-full bg-muted/30 rounded-lg overflow-hidden">
      {/* Image */}
      <img
        src={imageUrl}
        alt="Interface being analyzed"
        className="w-full h-full object-contain"
      />

      {/* Annotation Markers */}
      {showOverlay && issues.map((issue, index) => {
        if (!issue.position) return null;
        
        return (
          <button
            key={issue.id}
            className={cn(
              "annotation-marker transition-all duration-200",
              {
                'annotation-marker-critical': issue.severity === 'critical',
                'annotation-marker-moderate': issue.severity === 'moderate',
                'annotation-marker-minor': issue.severity === 'minor',
              },
              activeIssueId === issue.id && "ring-2 ring-foreground scale-125"
            )}
            style={{
              left: `${issue.position.x}%`,
              top: `${issue.position.y}%`,
            }}
            onClick={() => onIssueSelect(activeIssueId === issue.id ? null : issue.id)}
          >
            {index + 1}
          </button>
        );
      })}

      {/* Active Issue Popup */}
      {activeIssue && (
        <div 
          className="absolute z-20 max-w-sm animate-scale-in"
          style={{
            left: `${Math.min(Math.max((activeIssue.position?.x || 50) + 3, 5), 60)}%`,
            top: `${Math.min(Math.max((activeIssue.position?.y || 50) - 10, 5), 70)}%`,
          }}
        >
          <div className="relative">
            <button
              onClick={() => onIssueSelect(null)}
              className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <CritiqueCard issue={activeIssue} isActive />
          </div>
        </div>
      )}

      {/* Toggle Overlay */}
      <button
        onClick={() => setShowOverlay(!showOverlay)}
        className={cn(
          "absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          showOverlay 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        )}
      >
        {showOverlay ? 'Hide Annotations' : 'Show Annotations'}
      </button>
    </div>
  );
}
