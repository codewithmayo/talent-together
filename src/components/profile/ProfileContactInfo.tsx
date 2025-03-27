import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfile, SocialLink } from "@/lib/supabase";
import { ExternalLink, Globe, Instagram, Linkedin, Mail, Twitter, Youtube, Facebook, Twitch, Send, Slack, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileContactInfoProps {
  profile: UserProfile;
}

export function ProfileContactInfo({ profile }: ProfileContactInfoProps) {
  // Get the corresponding icon for a social platform
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitch':
        return <Twitch className="h-5 w-5" />;
      case 'tiktok':
        return <Send className="h-5 w-5" />; 
      case 'slack':
        return <Slack className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-medium mb-4">Contact Information</h3>
          <div className="space-y-4">
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  Website
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            )}
            
            {profile.email && (
              <div className="flex items-center gap-2 flex-wrap">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-primary hover:underline"
                >
                  {profile.email}
                </a>
                {profile.preferred_contact === 'email' && (
                  <Badge variant="secondary" className="ml-auto">Preferred</Badge>
                )}
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-2 flex-wrap">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={`tel:${profile.phone}`}
                  className="text-primary hover:underline"
                >
                  {profile.phone}
                </a>
                {profile.preferred_contact === 'phone' && (
                  <Badge variant="secondary" className="ml-auto">Preferred</Badge>
                )}
              </div>
            )}
            
            {profile.social_links && profile.social_links.length > 0 && (
              <>
                <Separator />
                
                <div className="flex flex-col gap-3">
                  {profile.social_links.map((social: SocialLink, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <a 
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                        title={social.platform}
                      >
                        {getSocialIcon(social.platform)}
                        <span className="capitalize">{social.platform}</span>
                      </a>
                      {social.followers !== undefined && (
                        <Badge variant="secondary" className="ml-auto">
                          {social.followers.toLocaleString()} followers
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
