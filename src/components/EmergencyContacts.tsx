import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Hospital, Flame, Shield } from "lucide-react";

interface EmergencyService {
  id: string;
  name: string;
  type: "police" | "hospital" | "fire";
  phone: string;
  distance: string;
}

interface EmergencyContactsProps {
  services: EmergencyService[];
}

const EmergencyContacts = ({ services }: EmergencyContactsProps) => {
  const getServiceIcon = (type: string) => {
    switch(type) {
      case "police": return <Shield className="w-5 h-5" />;
      case "hospital": return <Hospital className="w-5 h-5" />;
      case "fire": return <Flame className="w-5 h-5" />;
      default: return <Phone className="w-5 h-5" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch(type) {
      case "police": return "text-info";
      case "hospital": return "text-danger";
      case "fire": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-danger" />
          Emergency Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* SOS Button */}
        <Button variant="danger" className="w-full text-lg py-6 shadow-lg">
          <Phone className="w-6 h-6 mr-2" />
          SOS Emergency
        </Button>

        {/* Emergency Services List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Nearby Services</p>
          {services.map((service) => (
            <div 
              key={service.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={getServiceColor(service.type)}>
                  {getServiceIcon(service.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {service.distance} away
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
