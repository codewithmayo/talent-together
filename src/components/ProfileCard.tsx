import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Users, DollarSign } from "lucide-react";
import { ProfileEngagementDisplay } from "./profile/ProfileEngagementDisplay";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getTotalFollowers = () => {
    return profile.followers_count || 0;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-4">
        <div className="flex flex-col h-full gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.name} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium truncate">{profile.name}</h3>
                  {profile.type === "brand" && profile.budget_range && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {profile.budget_range}
                    </Badge>
                  )}
                  {profile.type === "brand" && 
                    typeof profile.min_budget !== 'undefined' && 
                    typeof profile.max_budget !== 'undefined' && 
                    !profile.budget_range && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${profile.min_budget.toLocaleString()} - ${profile.max_budget.toLocaleString()}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  className="flex-shrink-0"
                >
                  View
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.categories?.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {profile.categories && profile.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.categories.length - 3} more
                  </Badge>
                )}
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{getTotalFollowers().toLocaleString()} followers</span>
              </div>

              {profile.type === 'creator' && profile.engagement_stats && (
                <div className="mt-2">
                  <ProfileEngagementDisplay 
                    stats={profile.engagement_stats} 
                    totalFollowers={profile.followers_count || 0}
                  />
                </div>
              )}
            </div>
          </div>
          
          {profile.bio && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {profile.bio}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
