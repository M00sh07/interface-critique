import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a senior UI/UX designer and frontend engineer conducting a professional interface critique. You analyze digital interfaces with precision, clarity, and actionable insight.

Your analysis must be:
- Professional and direct
- Constructive, never generic
- Based on established UX principles
- Focused on clarity, usability, accessibility, and cognitive load

NEVER use buzzwords like "looks modern", "nice design", "good vibes", or generic praise.

You MUST evaluate the interface using these exact 6 categories, in this order:

A. VISUAL HIERARCHY
B. LAYOUT & SPACING
C. TYPOGRAPHY SYSTEM
D. COLOR & CONTRAST
E. INTERACTION & FEEDBACK
F. COGNITIVE LOAD

For each issue found, provide:
1. observation
2. whyItMatters
3. suggestion
4. severity
5. category
6. position

You MUST respond in valid JSON with this exact structure:
{
  "summary": "",
  "topPriority": {},
  "issues": [],
  "improvementDirection": "",
  "overallScore": 0
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, perspective = "designer" } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!AI_API_KEY) {
      console.error("AI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const perspectiveAddendum: Record<string, string> = {
      designer: "Focus on visual design principles, brand consistency, and aesthetic cohesion.",
      engineer: "Focus on implementation feasibility, component reusability, and technical debt indicators.",
      user: "Focus on first-time user confusion, discoverability issues, and task completion barriers.",
    };

    const perspectiveText = perspectiveAddendum[perspective] ?? perspectiveAddendum.designer;
    const fullPrompt = `${SYSTEM_PROMPT}\n\nPerspective emphasis: ${perspectiveText}`;

    console.log("Dispatching vision analysis request");

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: fullPrompt },
            {
              inline_data: {
                mime_type: "image/png",
                data: imageData.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
          ],
        },
      ],
    }),
  }
);


    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Request rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI request quota exceeded" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI analysis request failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
const content =
  data?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p.text)
    ?.join("");


    if (!content) {
      return new Response(
        JSON.stringify({ error: "Empty AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = match ? match[1].trim() : content;

    let analysis = JSON.parse(jsonText);

    if (analysis.issues) {
      analysis.issues = analysis.issues.map((issue: any, i: number) => ({
        ...issue,
        id: `issue-${i + 1}`,
      }));
    }

    if (analysis.topPriority && !analysis.topPriority.id) {
      analysis.topPriority.id = "top-priority";
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
