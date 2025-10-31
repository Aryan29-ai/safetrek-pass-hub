import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin, Plus } from "lucide-react";

interface Incident {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  location: string;
  description: string;
  time: string;
}

interface IncidentAlertProps {
  incidents: Incident[];
  onReportIncident: () => void;
}

const IncidentAlert = ({ incidents, onReportIncident }: IncidentAlertProps) => {
  const getIncidentVariant = (type: string) => {
    switch(type) {
      case "danger": return "danger";
      case "warning": return "warning";
      default: return "default";
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Live Incident Reports
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReportIncident}
          >
            <Plus className="w-4 h-4 mr-1" />
            Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={getIncidentVariant(incident.type) as any}>
                  {incident.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {incident.time}
                </span>
              </div>
              <h4 className="font-semibold mb-1">{incident.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
              <p className="text-xs flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {incident.location}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentAlert;
