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
    const { location } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    console.log('Fetching incidents for:', location);

    // Fetch weather alerts and safety information
    // In a production app, you'd integrate with official government alert APIs
    // For now, we'll return structured mock data based on location
    
    const incidents: any[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Weather Advisory',
        location: location,
        description: 'Monitor local weather conditions. Check forecast before traveling.',
        time: '2 hours ago',
        severity: 'medium',
      },
    ];

    // Add location-specific alerts
    if (location.toLowerCase().includes('manali') || location.toLowerCase().includes('himachal')) {
      incidents.push({
        id: '2',
        type: 'danger',
        title: 'Landslide Risk',
        location: location,
        description: 'Heavy rainfall may cause landslides in hilly areas. Drive with caution.',
        time: '1 hour ago',
        severity: 'high',
      });
    }

    if (location.toLowerCase().includes('mumbai') || location.toLowerCase().includes('delhi')) {
      incidents.push({
        id: '3',
        type: 'info',
        title: 'Traffic Update',
        location: location,
        description: 'Expect heavy traffic during peak hours. Plan accordingly.',
        time: '30 minutes ago',
        severity: 'low',
      });
    }

    return new Response(JSON.stringify({ incidents }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-incidents:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
