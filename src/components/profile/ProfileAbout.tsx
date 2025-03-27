import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin } from "lucide-react";
import { UserProfile } from "@/lib/supabase";
import { ProfileAnalytics } from "./ProfileAnalytics";

interface ProfileAboutProps {
  profile: UserProfile;
  followersCount?: number;
}

const formatGender = (gender: string) => {
  return gender.charAt(0).toUpperCase() + gender.slice(1).replace(/_/g, ' ');
};

export function ProfileAbout({ profile, followersCount }: ProfileAboutProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
          <CardDescription>
            {profile.type === "creator" ? "Creator information and expertise" : "Brand information and focus areas"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bio && (
            <div>
              <h4 className="font-medium mb-2">Bio</h4>
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
          
          {profile.type === "creator" && profile.gender && profile.gender !== "prefer_not_to_say" && (
            <div>
              <h4 className="font-medium mb-2">Gender</h4>
              <p className="text-sm">{formatGender(profile.gender)}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">{profile.type === "creator" ? "Content Categories" : "Industry Focus"}</h4>
            <div className="flex flex-wrap gap-2">
              {(profile.categories && profile.categories.length > 0) ? (
                profile.categories.map((category: string) => (
                  <Badge key={category} variant="secondary">{category}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">Not specified</span>
              )}
            </div>
          </div>

          {profile.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.type === 'creator' && (
        <ProfileAnalytics
          stats={profile.engagement_stats}
          totalFollowers={followersCount}
        />
      )}
    </div>
  );
}
