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
    const { query, location } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    console.log('Searching for:', query, location);

    // Search for places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' tourist attraction India')}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', searchData);
      throw new Error(`Google Places API error: ${searchData.status}`);
    }

    // Get detailed info for each place
    const places = await Promise.all(
      (searchData.results || []).slice(0, 8).map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,opening_hours,formatted_phone_number,website,photos,geometry,types&key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        const details = detailsData.result || {};
        
        // Get photo URL if available
        let photoUrl = place.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
          : null;

        return {
          id: place.place_id,
          name: details.name || place.name,
          location: details.formatted_address || place.formatted_address,
          description: place.types?.slice(0, 3).join(', ') || 'Tourist attraction',
          rating: details.rating || place.rating || 0,
          photoUrl,
          website: details.website,
          phone: details.formatted_phone_number,
          coordinates: {
            lat: details.geometry?.location?.lat || place.geometry?.location?.lat,
            lng: details.geometry?.location?.lng || place.geometry?.location?.lng,
          },
          openingHours: details.opening_hours?.weekday_text || [],
          isOpen: details.opening_hours?.open_now,
        };
      })
    );

    return new Response(JSON.stringify({ places }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in location-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
