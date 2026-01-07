import { Layers, LayoutGrid, Type, Palette, MousePointer, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CritiqueCategory, CRITIQUE_CATEGORIES, CritiqueIssue } from '@/types/critique';

const ICONS: Record<string, typeof Layers> = {
  Layers,
  LayoutGrid,
  Type,
  Palette,
  MousePointer,
  Brain,
};

interface CategoryTabsProps {
  activeCategory: CritiqueCategory | 'all';
  onCategoryChange: (category: CritiqueCategory | 'all') => void;
  issues: CritiqueIssue[];
}

export function CategoryTabs({ activeCategory, onCategoryChange, issues }: CategoryTabsProps) {
  const getIssueCount = (categoryId: CritiqueCategory) => 
    issues.filter(i => i.category === categoryId).length;

  const getCriticalCount = (categoryId: CritiqueCategory) =>
    issues.filter(i => i.category === categoryId && i.severity === 'critical').length;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
          activeCategory === 'all'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        )}
      >
        All Issues
        <span className="ml-1.5 opacity-70">({issues.length})</span>
      </button>
      
      {CRITIQUE_CATEGORIES.map((category) => {
        const Icon = ICONS[category.icon];
        const count = getIssueCount(category.id);
        const criticalCount = getCriticalCount(category.id);

        if (count === 0) return null;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{category.title}</span>
            <span className="opacity-70">({count})</span>
            {criticalCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-severity-critical" />
            )}
          </button>
        );
      })}
    </div>
  );
}
