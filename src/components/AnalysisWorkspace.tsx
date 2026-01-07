import { useState } from 'react';
import { ArrowLeft, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnnotatedOverlay } from './AnnotatedOverlay';
import { AnalysisSummary } from './AnalysisSummary';
import { CritiqueCard } from './CritiqueCard';
import { CategoryTabs } from './CategoryTabs';
import { PerspectiveToggle } from './PerspectiveToggle';
import { AnalysisResult, CritiqueCategory, Perspective } from '@/types/critique';
import { toast } from 'sonner';

interface AnalysisWorkspaceProps {
  imageUrl: string;
  result: AnalysisResult;
  onReset: () => void;
  perspective: Perspective;
  onPerspectiveChange: (perspective: Perspective) => void;
}

export function AnalysisWorkspace({ 
  imageUrl, 
  result, 
  onReset, 
  perspective,
  onPerspectiveChange 
}: AnalysisWorkspaceProps) {
  const [activeCategory, setActiveCategory] = useState<CritiqueCategory | 'all'>('all');
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isChangingPerspective, setIsChangingPerspective] = useState(false);

  const filteredIssues = activeCategory === 'all'
    ? result.issues
    : result.issues.filter(i => i.category === activeCategory);

  const handlePerspectiveChange = async (newPerspective: Perspective) => {
    if (newPerspective === perspective) return;
    setIsChangingPerspective(true);
    await onPerspectiveChange(newPerspective);
    setIsChangingPerspective(false);
  };

  const handleExport = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      perspective,
      summary: result.summary,
      overallScore: result.overallScore,
      topPriority: result.topPriority,
      issues: result.issues,
      improvementDirection: result.improvementDirection,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interface-critique-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const handleShare = () => {
    toast.info('Share functionality coming soon');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <PerspectiveToggle value={perspective} onChange={handlePerspectiveChange} />
              {isChangingPerspective && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="default" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary Section */}
          <div className="mb-8 animate-fade-in">
            <AnalysisSummary result={result} />
          </div>

          {/* Category Filter */}
          <div className="mb-6 animate-slide-up stagger-1 opacity-0">
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              issues={result.issues}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Annotated Image */}
            <div className="animate-slide-up stagger-2 opacity-0">
              <div className="sticky top-32">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Annotated View
                </h2>
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card">
                  <AnnotatedOverlay
                    imageUrl={imageUrl}
                    issues={result.issues}
                    activeIssueId={activeIssueId}
                    onIssueSelect={setActiveIssueId}
                  />
                </div>
              </div>
            </div>

            {/* Issue List */}
            <div className="animate-slide-up stagger-3 opacity-0">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Issues ({filteredIssues.length})
              </h2>
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <CritiqueCard
                    key={issue.id}
                    issue={issue}
                    isActive={activeIssueId === issue.id}
                    onClick={() => setActiveIssueId(
                      activeIssueId === issue.id ? null : issue.id
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
