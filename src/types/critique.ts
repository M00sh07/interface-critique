export type Severity = 'critical' | 'moderate' | 'minor';

export type Perspective = 'designer' | 'engineer' | 'user';

export interface CritiqueIssue {
  id: string;
  category: CritiqueCategory;
  severity: Severity;
  observation: string;
  whyItMatters: string;
  suggestion: string;
  position?: { x: number; y: number };
}

export type CritiqueCategory = 
  | 'visual-hierarchy'
  | 'layout-spacing'
  | 'typography'
  | 'color-contrast'
  | 'interaction-feedback'
  | 'cognitive-load';

export interface CritiqueCategoryInfo {
  id: CritiqueCategory;
  title: string;
  description: string;
  icon: string;
}

export interface AnalysisResult {
  summary: string;
  topPriority: CritiqueIssue;
  issues: CritiqueIssue[];
  improvementDirection: string;
  overallScore: number;
}

export interface UploadState {
  type: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  imageUrl?: string;
  fileName?: string;
  error?: string;
}

export const CRITIQUE_CATEGORIES: CritiqueCategoryInfo[] = [
  {
    id: 'visual-hierarchy',
    title: 'Visual Hierarchy',
    description: 'Primary focal point, competing attention zones, scan path, CTA visibility',
    icon: 'Layers',
  },
  {
    id: 'layout-spacing',
    title: 'Layout & Spacing',
    description: 'Alignment consistency, margin/padding logic, density, grid discipline',
    icon: 'LayoutGrid',
  },
  {
    id: 'typography',
    title: 'Typography System',
    description: 'Font pairing, heading hierarchy, line length, size scale coherence',
    icon: 'Type',
  },
  {
    id: 'color-contrast',
    title: 'Color & Contrast',
    description: 'Accessibility issues, accent overuse, visual noise, emotional tone',
    icon: 'Palette',
  },
  {
    id: 'interaction-feedback',
    title: 'Interaction & Feedback',
    description: 'Hover states, click feedback, loading transitions, responsiveness',
    icon: 'MousePointer',
  },
  {
    id: 'cognitive-load',
    title: 'Cognitive Load',
    description: 'Decisions per screen, label clarity, icon ambiguity, mental effort',
    icon: 'Brain',
  },
];
