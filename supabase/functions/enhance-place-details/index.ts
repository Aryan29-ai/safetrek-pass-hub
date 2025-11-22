import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Enhancing details for:', placeName, location);

    const systemPrompt = `You are a travel information expert. Provide detailed, accurate information about tourist places in India.
Return information in this exact JSON format:
{
  "description": "2-3 sentence engaging description",
  "entryFee": estimated entry fee in INR (number, 0 if free),
  "timing": "typical opening hours (e.g., 9 AM - 6 PM)",
  "bestSeason": "best time to visit (e.g., Oct - Mar)",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "tips": ["tip1", "tip2"]
}`;

    const userPrompt = `Provide detailed information about ${placeName} in ${location}. Include estimated entry fees, typical timings, best season to visit, highlights, and travel tips.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_place_details",
              description: "Provide detailed information about a tourist place",
              parameters: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  entryFee: { type: "number" },
                  timing: { type: "string" },
                  bestSeason: { type: "string" },
                  highlights: { 
                    type: "array",
                    items: { type: "string" }
                  },
                  tips: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["description", "entryFee", "timing", "bestSeason", "highlights", "tips"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_place_details" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (toolCall && toolCall.function.arguments) {
      const details = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(details),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('No valid response from AI');
  } catch (error) {
    console.error('Error in enhance-place-details:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        // Fallback data
        description: 'A popular tourist destination',
        entryFee: 0,
        timing: 'Open daily',
        bestSeason: 'Year-round',
        highlights: [],
        tips: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});