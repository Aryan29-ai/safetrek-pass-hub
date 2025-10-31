import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import qrPlaceholder from "@/assets/qr-placeholder.png";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";

interface User {
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  dob: string;
  safetyScore: number;
}

interface DigitalIDCardProps {
  user: User;
}

const DigitalIDCard = ({ user }: DigitalIDCardProps) => {
  const getSafetyColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getSafetyLabel = (score: number) => {
    if (score >= 80) return "Safe to Travel";
    if (score >= 60) return "Travel with Caution";
    return "High Risk";
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Digital Travel ID
          </span>
          <Badge 
            variant={getSafetyColor(user.safetyScore) as any}
            className="text-sm"
          >
            {getSafetyLabel(user.safetyScore)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - User info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {user.aadhaar}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>DOB: {user.dob}</span>
              </div>
            </div>

            {/* Safety Score Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Safety Score</span>
                <span className="font-bold">{user.safetyScore}/100</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    user.safetyScore >= 80 ? 'bg-success' :
                    user.safetyScore >= 60 ? 'bg-warning' : 'bg-danger'
                  }`}
                  style={{ width: `${user.safetyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right side - QR Code */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-32 h-32 bg-card border-2 border-border rounded-lg overflow-hidden">
              <img 
                src={qrPlaceholder} 
                alt="QR Code" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan for verification
            </p>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          View Full Digital ID
        </Button>
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;
