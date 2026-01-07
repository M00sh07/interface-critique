import { Paintbrush, Code, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Perspective } from '@/types/critique';

interface PerspectiveToggleProps {
  value: Perspective;
  onChange: (perspective: Perspective) => void;
}

const PERSPECTIVES = [
  { id: 'designer' as Perspective, label: 'Designer', icon: Paintbrush },
  { id: 'engineer' as Perspective, label: 'Engineer', icon: Code },
  { id: 'user' as Perspective, label: 'First-Time User', icon: User },
];

export function PerspectiveToggle({ value, onChange }: PerspectiveToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
      {PERSPECTIVES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            value === id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
