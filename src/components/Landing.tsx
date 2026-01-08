import { useState, useRef } from 'react';
import { Upload, Link, ArrowRight, Layers, LayoutGrid, Type, Palette, MousePointer, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LandingProps {
  onAnalyze: (imageUrl: string, source: 'upload' | 'url') => void;
}

const CATEGORIES = [
  { icon: Layers, label: 'Visual Hierarchy' },
  { icon: LayoutGrid, label: 'Layout & Spacing' },
  { icon: Type, label: 'Typography' },
  { icon: Palette, label: 'Color & Contrast' },
  { icon: MousePointer, label: 'Interaction' },
  { icon: Brain, label: 'Cognitive Load' },
];

export function Landing({ onAnalyze }: LandingProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
  if (!file.type.startsWith('image/')) return;

  // 🔴 GA EVENT — screenshot upload confirmed
  if (window.gtag) {
    window.gtag("event", "upload_screenshot", {
      event_category: "ai_analysis",
      event_label: "landing_upload",
    });
  }

  setIsLoading(true);
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    onAnalyze(dataUrl, 'upload');
  };
  reader.readAsDataURL(file);
};


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      setIsLoading(true);
      onAnalyze(url.trim(), 'url');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg">Interface Critic</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">How it works</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Examples</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Professional UI/UX
            <br />
            <span className="text-primary">Critique in Seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Get structured, actionable feedback on your interface. 
            The same analysis a senior designer would provide, powered by AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl mx-auto animate-slide-up stagger-1 opacity-0">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 justify-center">
            <Button
              variant={inputMode === 'upload' ? 'default' : 'muted'}
              size="sm"
              onClick={() => setInputMode('upload')}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
            <Button
              variant={inputMode === 'url' ? 'default' : 'muted'}
              size="sm"
              onClick={() => setInputMode('url')}
              className="gap-2"
            >
              <Link className="w-4 h-4" />
              Enter URL
            </Button>
          </div>

          {/* Upload Zone */}
          {inputMode === 'upload' && (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer group",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-card/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <Upload className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <p className="font-medium mb-1">
                    {isDragging ? 'Drop your screenshot here' : 'Drag & drop your screenshot'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse · PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* URL Input */}
          {inputMode === 'url' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 text-base bg-card border-border focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={handleUrlSubmit}
                  disabled={!url.trim() || isLoading}
                  className="shrink-0"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                We'll capture a screenshot and analyze the interface
              </p>
            </div>
          )}
        </div>

        {/* Categories Preview */}
        <div className="mt-16 max-w-4xl mx-auto animate-slide-up stagger-2 opacity-0">
          <p className="text-sm text-muted-foreground text-center mb-6">
            Analysis dimensions
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>Professional interface analysis tool</span>
          <span>Built for designers & developers</span>
        </div>
      </footer>
    </div>
  );
}
