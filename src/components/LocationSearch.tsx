import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface LocationSearchProps {
  onSearch: (location: string) => void;
}

const LocationSearch = ({ onSearch }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions] = useState([
    "Manali, Himachal Pradesh",
    "Goa Beaches",
    "Jaipur, Rajasthan",
    "Kerala Backwaters",
    "Mumbai, Maharashtra",
    "Delhi NCR",
    "Shimla, Himachal Pradesh",
    "Udaipur, Rajasthan"
  ]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Search Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search any location in India..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="flex-1"
          />
          <Button 
            variant="default"
            onClick={() => handleSearch(searchQuery)}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Popular Destinations</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="text-xs"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSearch;
