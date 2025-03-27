import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, DollarSign } from "lucide-react";
import { UserProfile } from "@/lib/supabase";

interface ProfileHeaderProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  followersCount: number;
}

export function ProfileHeader({ profile, isCurrentUser, followersCount }: ProfileHeaderProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
      <Avatar className="h-32 w-32">
        <AvatarImage src={profile.avatar_url} alt={profile.name} />
        <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {profile.type === "creator" ? (
                <Badge className="bg-primary/90">Creator</Badge>
              ) : (
                <Badge className="bg-blue-500/90">Brand</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {profile.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.type === "brand" && (
                <>
                  {profile.budget_range && (
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{profile.budget_range}</span>
                    </div>
                  )}
                  {typeof profile.min_budget !== 'undefined' && 
                   typeof profile.max_budget !== 'undefined' && 
                   !profile.budget_range && (
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${profile.min_budget.toLocaleString()} - ${profile.max_budget.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {profile.categories && profile.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Followers: </span>
              <span className="font-bold ml-1">{followersCount || profile.followers_count || 0}</span>
            </div>
            
            {isCurrentUser && (
              <Button variant="outline" onClick={() => navigate('/profile-edit')}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
