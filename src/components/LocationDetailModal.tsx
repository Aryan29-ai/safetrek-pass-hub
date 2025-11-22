import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Phone, Globe, Clock, AlertTriangle, Cloud } from "lucide-react";
import MapView from "./MapView";

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    id: string;
    name: string;
    location: string;
    description: string;
    photoUrl?: string;
    website?: string;
    phone?: string;
    rating?: number;
    coordinates: { lat: number; lng: number };
    openingHours?: string[];
    isOpen?: boolean;
  } | null;
  weather: any;
  incidents: any[];
  onGetDirections: () => void;
  onSOS: () => void;
}

const LocationDetailModal = ({
  isOpen,
  onClose,
  location,
  weather,
  incidents,
  onGetDirections,
  onSOS,
}: LocationDetailModalProps) => {
  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{location.name}</DialogTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location.location}
          </p>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            {location.photoUrl && (
              <img
                src={location.photoUrl}
                alt={location.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            <div className="space-y-3">
              <p className="text-sm">{location.description}</p>

              {location.rating && (
                <div className="flex items-center gap-2">
                  <Badge variant="default">⭐ {location.rating}</Badge>
                  {location.isOpen !== undefined && (
                    <Badge variant={location.isOpen ? "success" : "danger"}>
                      {location.isOpen ? "Open Now" : "Closed"}
                    </Badge>
                  )}
                </div>
              )}

              {(location as any).highlights && (location as any).highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Highlights</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {(location as any).highlights.map((highlight: string, idx: number) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(location as any).tips && (location as any).tips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Travel Tips</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    {(location as any).tips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {location.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${location.phone}`} className="text-primary hover:underline">
                    {location.phone}
                  </a>
                </div>
              )}

              {location.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Official Website
                  </a>
                </div>
              )}

              {location.openingHours && location.openingHours.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Opening Hours
                  </h4>
                  <div className="text-sm space-y-1">
                    {location.openingHours.map((hours, idx) => (
                      <p key={idx}>{hours}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={onGetDirections} className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              {location.website && (
                <Button
                  variant="success"
                  onClick={() => window.open(location.website, '_blank')}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Book Pass
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="h-96">
              <MapView
                center={location.coordinates}
                markers={[
                  {
                    position: location.coordinates,
                    title: location.name,
                  },
                ]}
                zoom={15}
              />
            </div>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            {weather ? (
              <>
                <div className="p-4 bg-gradient-primary rounded-lg text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{weather.location}</h3>
                      <p className="text-sm opacity-90">{weather.description}</p>
                    </div>
                    <div className="text-center">
                      <Cloud className="w-12 h-12 mx-auto" />
                      <p className="text-3xl font-bold">{weather.temperature}°C</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="font-semibold">{weather.windSpeed} km/h</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Forecast</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {weather.forecast.map((day: any, idx: number) => (
                      <div key={idx} className="text-center p-2 bg-muted rounded">
                        <p className="text-xs font-medium">{day.day}</p>
                        <p className="text-lg font-bold">{day.temp}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">Loading weather data...</p>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-3">
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        incident.type === 'danger'
                          ? 'danger'
                          : incident.type === 'warning'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {incident.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{incident.time}</span>
                  </div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {incident.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No alerts for this location</p>
            )}
          </TabsContent>
        </Tabs>

        <Button variant="danger" onClick={onSOS} className="w-full">
          <AlertTriangle className="w-4 h-4 mr-2" />
          SOS Emergency
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailModal;
