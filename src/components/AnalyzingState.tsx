import { useEffect, useState } from 'react';
import { Layers, LayoutGrid, Type, Palette, MousePointer, Brain, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  { icon: Layers, label: 'Scanning visual hierarchy...' },
  { icon: LayoutGrid, label: 'Evaluating layout structure...' },
  { icon: Type, label: 'Analyzing typography system...' },
  { icon: Palette, label: 'Checking color & contrast...' },
  { icon: MousePointer, label: 'Reviewing interaction patterns...' },
  { icon: Brain, label: 'Assessing cognitive load...' },
];

interface AnalyzingStateProps {
  imageUrl: string;
}

export function AnalyzingState({ imageUrl }: AnalyzingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full">
        {/* Preview Image */}
        <div className="relative mb-12 animate-fade-in">
          <div className="aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-2xl">
            <img
              src={imageUrl}
              alt="Analyzing interface"
              className="w-full h-full object-cover"
            />
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent animate-pulse" />
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="max-w-md mx-auto space-y-3">
          {ANALYSIS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isComplete = completedSteps.includes(index);
            const isCurrent = currentStep === index;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isComplete
                    ? 'bg-success/10 text-success'
                    : isCurrent
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                }`}
                style={{ 
                  opacity: index <= currentStep ? 1 : 0.4,
                  transform: `translateX(${index <= currentStep ? 0 : 10}px)`,
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
