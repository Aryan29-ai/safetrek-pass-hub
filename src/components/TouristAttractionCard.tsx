import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Calendar, IndianRupee, Shield } from "lucide-react";

interface Attraction {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  entryFee: number;
  timing: string;
  bestSeason: string;
  safetyScore?: number;
}

interface TouristAttractionCardProps {
  attraction: Attraction;
}

const TouristAttractionCard = ({ attraction }: TouristAttractionCardProps) => {
  const getSafetyColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 75) return "warning";
    return "danger";
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-elevated transition-all hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={attraction.image} 
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        {attraction.safetyScore && (
          <div className="absolute top-3 right-3">
            <Badge variant={getSafetyColor(attraction.safetyScore)} className="shadow-md flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Safety: {attraction.safetyScore}%
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold mb-1">{attraction.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {attraction.location}
          </p>
        </div>

        <p className="text-sm line-clamp-2">{attraction.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{attraction.timing}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span>{attraction.bestSeason}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <IndianRupee className="w-3 h-3 text-muted-foreground" />
            <span>Entry Fee: ₹{attraction.entryFee}</span>
          </div>
        </div>

        <Button variant="default" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default TouristAttractionCard;