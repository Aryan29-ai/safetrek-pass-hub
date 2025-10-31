import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, MapPin, Droplets, Wind, Sun } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Sun") || condition.includes("Clear")) return <Sun className="w-8 h-8" />;
    if (condition.includes("Rain")) return <Droplets className="w-8 h-8" />;
    return <Cloud className="w-8 h-8" />;
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Current Location Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 bg-gradient-primary rounded-lg text-primary-foreground">
          <div>
            <h3 className="text-2xl font-bold mb-1">{weather.location}</h3>
            <p className="text-sm opacity-90">{weather.condition}</p>
          </div>
          <div className="text-center">
            {getWeatherIcon(weather.condition)}
            <p className="text-4xl font-bold mt-2">{weather.temperature}°C</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Droplets className="w-5 h-5 text-info" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Wind className="w-5 h-5 text-info" />
            <div>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div>
          <h4 className="font-semibold mb-3">7-Day Forecast</h4>
          <div className="grid grid-cols-7 gap-2">
            {weather.forecast.map((day, index) => (
              <div 
                key={index}
                className="text-center p-2 bg-muted rounded-lg hover:bg-accent transition-colors"
              >
                <p className="text-xs font-medium mb-1">{day.day}</p>
                {getWeatherIcon(day.condition)}
                <p className="text-sm font-bold mt-1">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
