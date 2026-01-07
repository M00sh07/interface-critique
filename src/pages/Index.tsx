import { useState } from 'react';
import { Landing } from '@/components/Landing';
import { AnalyzingState } from '@/components/AnalyzingState';
import { AnalysisWorkspace } from '@/components/AnalysisWorkspace';
import { useAnalysis } from '@/hooks/useAnalysis';
import { AnalysisResult, UploadState, Perspective } from '@/types/critique';
import { toast } from 'sonner';

const Index = () => {
  const [uploadState, setUploadState] = useState<UploadState>({ type: 'idle' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentPerspective, setCurrentPerspective] = useState<Perspective>('designer');
  const { analyzeInterface, isAnalyzing } = useAnalysis();

  const handleAnalyze = async (imageUrl: string, source: 'upload' | 'url') => {
    setUploadState({ 
      type: 'analyzing', 
      imageUrl,
    });

    const result = await analyzeInterface(imageUrl, currentPerspective);
    
    if (result) {
      setAnalysisResult(result);
      setUploadState({ type: 'complete', imageUrl });
      toast.success('Analysis complete!');
    } else {
      setUploadState({ type: 'error', imageUrl, error: 'Analysis failed' });
    }
  };

  const handlePerspectiveChange = async (perspective: Perspective) => {
    setCurrentPerspective(perspective);
    
    // Re-analyze with new perspective if we have an image
    if (uploadState.imageUrl && uploadState.type === 'complete') {
      setUploadState({ type: 'analyzing', imageUrl: uploadState.imageUrl });
      
      const result = await analyzeInterface(uploadState.imageUrl, perspective);
      
      if (result) {
        setAnalysisResult(result);
        setUploadState({ type: 'complete', imageUrl: uploadState.imageUrl });
      } else {
        setUploadState({ type: 'complete', imageUrl: uploadState.imageUrl });
      }
    }
  };

  const handleReset = () => {
    setUploadState({ type: 'idle' });
    setAnalysisResult(null);
  };

  // Render based on state
  if (uploadState.type === 'analyzing' && uploadState.imageUrl) {
    return <AnalyzingState imageUrl={uploadState.imageUrl} />;
  }

  if (uploadState.type === 'complete' && uploadState.imageUrl && analysisResult) {
    return (
      <AnalysisWorkspace
        imageUrl={uploadState.imageUrl}
        result={analysisResult}
        onReset={handleReset}
        perspective={currentPerspective}
        onPerspectiveChange={handlePerspectiveChange}
      />
    );
  }

  return <Landing onAnalyze={handleAnalyze} />;
};

export default Index;
