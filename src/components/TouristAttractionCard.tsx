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
  requiredSafetyScore: number;
}

interface TouristAttractionCardProps {
  attraction: Attraction;
  userSafetyScore: number;
}

const TouristAttractionCard = ({ attraction, userSafetyScore }: TouristAttractionCardProps) => {
  const canBuyPass = userSafetyScore >= attraction.requiredSafetyScore;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-elevated transition-all hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={attraction.image} 
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={canBuyPass ? "default" : "destructive"} className="shadow-md">
            {canBuyPass ? "Eligible" : "Not Eligible"}
          </Badge>
        </div>
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
          <div className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3 text-muted-foreground" />
            <span>₹{attraction.entryFee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span>Score: {attraction.requiredSafetyScore}+</span>
          </div>
        </div>

        {canBuyPass ? (
          <Button variant="success" className="w-full">
            Buy Tourist Pass
          </Button>
        ) : (
          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled>
              Pass Unavailable
            </Button>
            <p className="text-xs text-danger text-center">
              Safety score too low. Required: {attraction.requiredSafetyScore}, Your score: {userSafetyScore}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TouristAttractionCard;
