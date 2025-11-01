import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DigitalIDCard from "@/components/DigitalIDCard";
import WeatherCard from "@/components/WeatherCard";
import LocationSearch from "@/components/LocationSearch";
import TouristAttractionCard from "@/components/TouristAttractionCard";
import IncidentAlert from "@/components/IncidentAlert";
import EmergencyContacts from "@/components/EmergencyContacts";
import LocationDetailModal from "@/components/LocationDetailModal";
import TravelChatbot from "@/components/TravelChatbot";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";


// Import attraction images
import manaliImg from "@/assets/manali.jpg";
import goaImg from "@/assets/goa.jpg";
import jaipurImg from "@/assets/jaipur.jpg";
import keralaImg from "@/assets/kerala.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeWeather, setPlaceWeather] = useState<any>(null);
  const [placeIncidents, setPlaceIncidents] = useState<any[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyServices, setNearbyServices] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    };

    checkAuth();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          fetchWeather(coords);
          fetchNearbyServices(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
          // Default to Mumbai
          fetchWeather(null, "Mumbai");
        }
      );
    }
  }, [navigate]);

  const fetchWeather = async (coords: { lat: number; lng: number } | null, city?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: coords ? { lat: coords.lat, lng: coords.lng } : { city },
      });

      if (error) throw error;
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Failed to load weather data');
    }
  };

  const fetchNearbyServices = async (coords: { lat: number; lng: number }) => {
    try {
      const types = ['police', 'hospital', 'fire'];
      const allServices = [];

      for (const type of types) {
        const { data, error } = await supabase.functions.invoke('nearby-services', {
          body: { lat: coords.lat, lng: coords.lng, type },
        });

        if (!error && data?.services) {
          allServices.push(...data.services.slice(0, 1).map((s: any) => ({ ...s, type })));
        }
      }

      setNearbyServices(allServices);
    } catch (error) {
      console.error('Error fetching nearby services:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = async (location: string) => {
    setSelectedLocation(location);
    toast.loading('Searching...');
    
    try {
      const { data, error } = await supabase.functions.invoke('location-search', {
        body: { query: location, location },
      });

      if (error) throw error;

      setSearchResults(data.places || []);
      
      // Fetch incidents for this location
      const { data: incidentData } = await supabase.functions.invoke('get-incidents', {
        body: { location },
      });
      
      if (incidentData?.incidents) {
        setIncidents(incidentData.incidents);
      }

      toast.success(`Found ${data.places?.length || 0} attractions`);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Failed to search locations');
    }
  };

  const handlePlaceClick = async (place: any) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);

    // Fetch weather for this place
    try {
      const { data: weatherData } = await supabase.functions.invoke('get-weather', {
        body: { lat: place.coordinates.lat, lng: place.coordinates.lng },
      });
      setPlaceWeather(weatherData);
    } catch (error) {
      console.error('Error fetching place weather:', error);
    }

    // Fetch incidents for this place
    try {
      const { data: incidentData } = await supabase.functions.invoke('get-incidents', {
        body: { location: place.location },
      });
      setPlaceIncidents(incidentData?.incidents || []);
    } catch (error) {
      console.error('Error fetching place incidents:', error);
    }
  };

  const handleGetDirections = () => {
    if (!userLocation || !selectedPlace) {
      toast.error('Location not available');
      return;
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`;
    
    // Open directly in Google Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
    toast.success('Opening directions in Google Maps...');
  };

  const handleSOS = () => {
    if (!userLocation) {
      toast.error('Location not available');
      return;
    }

    // Share location with emergency contacts
    const locationUrl = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
    const message = `🆘 EMERGENCY! I need help. My current location: ${locationUrl}`;
    
    toast.success('SOS Alert sent!', {
      description: 'Emergency services have been notified',
      duration: 5000,
    });

    // In a real app, this would send SMS/notifications to emergency contacts
    console.log('SOS triggered:', message);

    // Show nearby services
    if (nearbyServices.length > 0) {
      const policeStation = nearbyServices.find(s => s.type === 'police');
      if (policeStation) {
        toast.info(`Nearest Police: ${policeStation.name} - ${policeStation.distance}`, {
          duration: 8000,
        });
      }
    }
  };

  const handleReportIncident = () => {
    toast.info("Incident reporting feature coming soon!");
  };

  // Display attractions from search or default ones
  const displayAttractions = searchResults.length > 0 ? searchResults : [
    {
      id: "1",
      name: "Solang Valley",
      location: "Manali, Himachal Pradesh",
      photoUrl: manaliImg,
      description: "Beautiful valley known for adventure sports and scenic beauty.",
      entryFee: 500,
      timing: "6 AM - 6 PM",
      bestSeason: "Oct - Mar",
      safetyScore: 85,
      coordinates: { lat: 32.3194, lng: 77.1570 },
      website: "https://himachaltourism.gov.in/"
    },
    {
      id: "2",
      name: "Baga Beach",
      location: "Goa",
      photoUrl: goaImg,
      description: "Popular beach destination with water sports and nightlife.",
      entryFee: 0,
      timing: "Open 24/7",
      bestSeason: "Nov - Feb",
      safetyScore: 90,
      coordinates: { lat: 15.5557, lng: 73.7514 },
      website: "https://www.goatourism.gov.in/"
    },
    {
      id: "3",
      name: "Hawa Mahal",
      location: "Jaipur, Rajasthan",
      photoUrl: jaipurImg,
      description: "Iconic pink sandstone palace with intricate latticework windows.",
      entryFee: 200,
      timing: "9 AM - 5 PM",
      bestSeason: "Oct - Mar",
      safetyScore: 95,
      coordinates: { lat: 26.9239, lng: 75.8267 },
      website: "https://tourism.rajasthan.gov.in/"
    },
    {
      id: "4",
      name: "Alleppey Backwaters",
      location: "Kerala",
      photoUrl: keralaImg,
      description: "Serene backwater network with houseboat cruises.",
      entryFee: 1500,
      timing: "24 hours",
      bestSeason: "Sep - Mar",
      safetyScore: 88,
      coordinates: { lat: 9.4981, lng: 76.3388 },
      website: "https://www.keralatourism.org/"
    }
  ];

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Bharat SafeTourism
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Welcome back, {profile.full_name}!</h2>
          <p className="text-muted-foreground">Explore India safely with real-time updates</p>
        </div>

        {/* Digital ID Section */}
        <DigitalIDCard />

        {/* Current Location & Weather */}
        {weatherData && <WeatherCard weather={weatherData} />}

        {/* Search Section */}
        <LocationSearch onSearch={handleSearch} />

        {/* Tourist Attractions */}
        <section>
          <h3 className="text-2xl font-bold mb-4">
            {selectedLocation ? `Attractions in ${selectedLocation}` : "Popular Destinations"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayAttractions.map((attraction) => (
              <div key={attraction.id} onClick={() => handlePlaceClick(attraction)} className="cursor-pointer">
                <TouristAttractionCard
                  attraction={{
                    ...attraction,
                    image: attraction.photoUrl || attraction.image,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Grid - Incidents & Emergency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentAlert 
            incidents={incidents} 
            onReportIncident={handleReportIncident}
          />
          <EmergencyContacts 
            services={nearbyServices.map(s => ({
              id: s.id,
              name: s.name,
              type: s.type,
              phone: s.phone || '100',
              distance: s.distance,
            }))} 
            onSOS={handleSOS}
          />
        </div>
      </main>

      {/* Location Detail Modal */}
      <LocationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        location={selectedPlace}
        weather={placeWeather}
        incidents={placeIncidents}
        onGetDirections={handleGetDirections}
        onSOS={handleSOS}
      />

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Bharat SafeTourism. Travel Safe, Travel Smart.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
