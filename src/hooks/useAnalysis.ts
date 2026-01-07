import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, Perspective } from '@/types/critique';
import { toast } from 'sonner';

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeInterface = async (
    imageData: string,
    perspective: Perspective = 'designer'
  ): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-interface', {
        body: { imageData, perspective }
      });

      if (functionError) {
        console.error('Analysis error:', functionError);
        setError(functionError.message || 'Analysis failed');
        toast.error('Analysis failed. Please try again.');
        return null;
      }

      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        return null;
      }

      return data as AnalysisResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error('Failed to analyze interface');
      console.error('Analysis error:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeInterface,
    isAnalyzing,
    error,
  };
}
