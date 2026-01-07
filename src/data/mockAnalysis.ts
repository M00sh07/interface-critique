import { AnalysisResult, CritiqueIssue } from '@/types/critique';

export const generateMockAnalysis = (): AnalysisResult => {
  const issues: CritiqueIssue[] = [
    {
      id: '1',
      category: 'visual-hierarchy',
      severity: 'critical',
      observation: 'No clear primary call-to-action above the fold',
      whyItMatters: 'Users cannot identify the next step within the first 3 seconds, leading to increased bounce rates and confusion about the page purpose.',
      suggestion: 'Add a prominent CTA button with high contrast colors positioned in the upper third of the viewport.',
      position: { x: 50, y: 25 },
    },
    {
      id: '2',
      category: 'visual-hierarchy',
      severity: 'moderate',
      observation: 'Multiple elements competing for attention in the hero section',
      whyItMatters: 'Competing focal points create cognitive overload and dilute the impact of the primary message.',
      suggestion: 'Reduce visual weight of secondary elements using opacity, size reduction, or remove non-essential items.',
      position: { x: 30, y: 35 },
    },
    {
      id: '3',
      category: 'layout-spacing',
      severity: 'moderate',
      observation: 'Inconsistent margins between content sections',
      whyItMatters: 'Irregular spacing disrupts visual rhythm and makes the layout feel unpolished and amateur.',
      suggestion: 'Establish a consistent spacing scale (8px base) and apply it systematically across all sections.',
      position: { x: 15, y: 60 },
    },
    {
      id: '4',
      category: 'typography',
      severity: 'critical',
      observation: 'Body text line length exceeds 75 characters',
      whyItMatters: 'Optimal readability occurs between 45-75 characters per line. Longer lines cause eye fatigue and reduce comprehension.',
      suggestion: 'Constrain content width using max-width: 65ch or implement a narrower content container.',
      position: { x: 50, y: 55 },
    },
    {
      id: '5',
      category: 'typography',
      severity: 'minor',
      observation: 'Heading hierarchy jumps from H1 to H4',
      whyItMatters: 'Skipped heading levels break semantic structure and negatively impact accessibility and SEO.',
      suggestion: 'Use sequential heading levels (H1 → H2 → H3) to maintain proper document outline.',
      position: { x: 25, y: 45 },
    },
    {
      id: '6',
      category: 'color-contrast',
      severity: 'critical',
      observation: 'Secondary text fails WCAG AA contrast requirements',
      whyItMatters: 'Low contrast text is illegible for users with visual impairments and causes strain in low-light conditions.',
      suggestion: 'Increase contrast ratio to minimum 4.5:1 for normal text, 3:1 for large text.',
      position: { x: 70, y: 40 },
    },
    {
      id: '7',
      category: 'color-contrast',
      severity: 'moderate',
      observation: 'Accent color overused across 6+ elements',
      whyItMatters: 'When everything is highlighted, nothing stands out. Excessive accent usage diminishes its effectiveness.',
      suggestion: 'Reserve accent color for 1-2 key actions. Use neutral tones for secondary interactive elements.',
      position: { x: 80, y: 30 },
    },
    {
      id: '8',
      category: 'interaction-feedback',
      severity: 'moderate',
      observation: 'Buttons lack visible hover state differentiation',
      whyItMatters: 'Missing hover states reduce perceived interactivity and make clickable areas uncertain.',
      suggestion: 'Add subtle background color shift, elevation change, or underline on hover.',
      position: { x: 60, y: 70 },
    },
    {
      id: '9',
      category: 'cognitive-load',
      severity: 'minor',
      observation: 'Form requires 8+ decisions before submission',
      whyItMatters: 'Each decision point increases cognitive load and dropout probability.',
      suggestion: 'Group related fields, use smart defaults, or split into progressive steps.',
      position: { x: 40, y: 80 },
    },
    {
      id: '10',
      category: 'cognitive-load',
      severity: 'moderate',
      observation: 'Navigation contains ambiguous icon-only buttons',
      whyItMatters: 'Icons without labels require users to guess functionality, increasing error rates.',
      suggestion: 'Add text labels or implement tooltips that appear on hover/focus.',
      position: { x: 85, y: 15 },
    },
  ];

  const topPriority = issues.find(i => i.severity === 'critical') || issues[0];

  return {
    summary: 'This interface shows promise but has significant hierarchy and accessibility issues that impact usability. The layout lacks a clear visual path, forcing users to scan extensively. Critical contrast failures need immediate attention for compliance.',
    topPriority,
    issues,
    improvementDirection: 'Focus on establishing a single, clear visual hierarchy with one dominant CTA. Reduce competing elements in the hero section. Address contrast issues systematically using a refined color palette with verified accessibility ratios. The goal is a cleaner, more decisive interface that guides users confidently toward their objective.',
    overallScore: 58,
  };
};
