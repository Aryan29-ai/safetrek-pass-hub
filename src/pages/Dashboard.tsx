import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DigitalIDCard from "@/components/DigitalIDCard";
import WeatherCard from "@/components/WeatherCard";
import LocationSearch from "@/components/LocationSearch";
import TouristAttractionCard from "@/components/TouristAttractionCard";
import IncidentAlert from "@/components/IncidentAlert";
import EmergencyContacts from "@/components/EmergencyContacts";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";

// Import attraction images
import manaliImg from "@/assets/manali.jpg";
import goaImg from "@/assets/goa.jpg";
import jaipurImg from "@/assets/jaipur.jpg";
import keralaImg from "@/assets/kerala.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = (location: string) => {
    setSelectedLocation(location);
    toast.success(`Searching for ${location}...`);
  };

  const handleReportIncident = () => {
    toast.info("Incident reporting feature coming soon!");
  };

  // Mock data
  const weatherData = {
    location: "Mumbai, Maharashtra",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 12,
    forecast: [
      { day: "Mon", temp: 28, condition: "Sunny" },
      { day: "Tue", temp: 29, condition: "Sunny" },
      { day: "Wed", temp: 27, condition: "Cloudy" },
      { day: "Thu", temp: 26, condition: "Rain" },
      { day: "Fri", temp: 27, condition: "Cloudy" },
      { day: "Sat", temp: 28, condition: "Sunny" },
      { day: "Sun", temp: 29, condition: "Sunny" }
    ]
  };

  const attractions = [
    {
      id: "1",
      name: "Solang Valley",
      location: "Manali, Himachal Pradesh",
      image: manaliImg,
      description: "Beautiful valley known for adventure sports and scenic beauty. Perfect for skiing and paragliding.",
      entryFee: 500,
      timing: "6 AM - 6 PM",
      bestSeason: "Oct - Mar",
      requiredSafetyScore: 70
    },
    {
      id: "2",
      name: "Baga Beach",
      location: "Goa",
      image: goaImg,
      description: "Popular beach destination with water sports, beach shacks, and vibrant nightlife.",
      entryFee: 0,
      timing: "Open 24/7",
      bestSeason: "Nov - Feb",
      requiredSafetyScore: 60
    },
    {
      id: "3",
      name: "Hawa Mahal",
      location: "Jaipur, Rajasthan",
      image: jaipurImg,
      description: "Iconic pink sandstone palace with intricate latticework windows. A UNESCO World Heritage site.",
      entryFee: 200,
      timing: "9 AM - 5 PM",
      bestSeason: "Oct - Mar",
      requiredSafetyScore: 50
    },
    {
      id: "4",
      name: "Alleppey Backwaters",
      location: "Kerala",
      image: keralaImg,
      description: "Serene backwater network with houseboat cruises through lush tropical landscapes.",
      entryFee: 1500,
      timing: "24 hours",
      bestSeason: "Sep - Mar",
      requiredSafetyScore: 65
    }
  ];

  const incidents = [
    {
      id: "1",
      type: "warning" as const,
      title: "Heavy Rainfall Alert",
      location: "Manali, HP",
      description: "Expect heavy rainfall in the next 24 hours. Road conditions may be affected.",
      time: "2 hours ago"
    },
    {
      id: "2",
      type: "danger" as const,
      title: "Landslide Warning",
      location: "Rohtang Pass",
      description: "Road temporarily closed due to landslide risk. Alternative routes available.",
      time: "4 hours ago"
    },
    {
      id: "3",
      type: "info" as const,
      title: "Traffic Update",
      location: "Delhi NCR",
      description: "Heavy traffic reported on NH-48. Consider alternative routes.",
      time: "1 hour ago"
    }
  ];

  const emergencyServices = [
    {
      id: "1",
      name: "City Police Station",
      type: "police" as const,
      phone: "100",
      distance: "1.2 km"
    },
    {
      id: "2",
      name: "District Hospital",
      type: "hospital" as const,
      phone: "108",
      distance: "2.5 km"
    },
    {
      id: "3",
      name: "Fire Station",
      type: "fire" as const,
      phone: "101",
      distance: "1.8 km"
    }
  ];

  if (!user) return null;

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
          <h2 className="text-3xl font-bold">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">Explore India safely with real-time updates</p>
        </div>

        {/* Digital ID Section */}
        <DigitalIDCard user={user} />

        {/* Current Location & Weather */}
        <WeatherCard weather={weatherData} />

        {/* Search Section */}
        <LocationSearch onSearch={handleSearch} />

        {/* Tourist Attractions */}
        <section>
          <h3 className="text-2xl font-bold mb-4">
            {selectedLocation ? `Attractions in ${selectedLocation}` : "Popular Destinations"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attractions.map((attraction) => (
              <TouristAttractionCard
                key={attraction.id}
                attraction={attraction}
                userSafetyScore={user.safetyScore}
              />
            ))}
          </div>
        </section>

        {/* Bottom Grid - Incidents & Emergency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentAlert 
            incidents={incidents} 
            onReportIncident={handleReportIncident}
          />
          <EmergencyContacts services={emergencyServices} />
        </div>
      </main>

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
