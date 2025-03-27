
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDescription } from "@/components/ui/form";
import { Instagram, Youtube, Twitter, Globe, Twitch, Send, Linkedin, Facebook, Slack } from "lucide-react";

interface PrimarySocialPlatformProps {
  value: string | undefined;
  onChange: (value: string) => void;
  type?: "creator" | "brand";
}

const creatorPlatforms = [
  { label: "Instagram", value: "Instagram", icon: Instagram },
  { label: "YouTube", value: "YouTube", icon: Youtube },
  { label: "Twitter", value: "Twitter", icon: Twitter },
  { label: "TikTok", value: "TikTok", icon: Send }, // Using Send icon as a replacement for TikTok
  { label: "Twitch", value: "Twitch", icon: Twitch },
  { label: "Facebook", value: "Facebook", icon: Facebook },
  { label: "LinkedIn", value: "LinkedIn", icon: Linkedin },
  { label: "Slack", value: "Slack", icon: Slack },
  { label: "Other", value: "Other", icon: Globe },
];

const brandPlatforms = [
  { label: "Instagram", value: "Instagram", icon: Instagram },
  { label: "Facebook", value: "Facebook", icon: Facebook },
  { label: "LinkedIn", value: "LinkedIn", icon: Linkedin },
  { label: "Twitter", value: "Twitter", icon: Twitter },
  { label: "YouTube", value: "YouTube", icon: Youtube },
  { label: "TikTok", value: "TikTok", icon: Send }, // Using Send icon as a replacement for TikTok
  { label: "Slack", value: "Slack", icon: Slack },
  { label: "Other", value: "Other", icon: Globe },
];

export function PrimarySocialPlatform({ value, onChange, type = "creator" }: PrimarySocialPlatformProps) {
  const platforms = type === "creator" ? creatorPlatforms : brandPlatforms;
  
  const description = type === "creator" 
    ? "Choose the platform where you have the most followers or engagement. This will be displayed prominently on your profile."
    : "Select your brand's primary social media platform. This will help creators understand where your brand is most active.";

  return (
    <div className="space-y-2">
      <Label htmlFor="primary-platform">Primary Social Platform</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="primary-platform">
          <SelectValue placeholder="Select your main platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <SelectItem key={platform.value} value={platform.value}>
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{platform.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <FormDescription>
        {description}
      </FormDescription>
    </div>
  );
}
