import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
  phone: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

const DigitalIDCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return null;
  }

  const qrCodeUrl = `${window.location.origin}/documents?userId=${userId}`;

  return (
    <Card className="shadow-elevated">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - User info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Digital Travel ID
                </h3>
                <p className="text-2xl font-bold">{profile.full_name}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.date_of_birth && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>DOB: {new Date(profile.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {profile.blood_group && (
                <Badge variant="secondary">
                  Blood Group: {profile.blood_group}
                </Badge>
              )}
            </div>

            {profile.emergency_contact_name && (
              <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                <p className="font-semibold">Emergency Contact:</p>
                <p>{profile.emergency_contact_name}</p>
                {profile.emergency_contact_phone && (
                  <p>{profile.emergency_contact_phone}</p>
                )}
              </div>
            )}
          </div>

          {/* Right side - QR Code */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-32 h-32 bg-white p-2 border-2 border-border rounded-lg">
              <QRCodeSVG value={qrCodeUrl} size={112} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan for document upload
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;