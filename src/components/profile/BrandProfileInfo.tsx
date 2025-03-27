import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BrandProfileInfoProps {
  profile: {
    collaboration_types?: string[];
    preferred_creator_niches?: string[];
    partnership_goals?: string;
    past_collaborations?: string;
    budget_range?: string;
    min_budget?: number;
    max_budget?: number;
  };
}

export function BrandProfileInfo({ profile }: BrandProfileInfoProps) {
  const getBudgetDisplay = () => {
    if (profile.budget_range) {
      return profile.budget_range;
    } else if (profile.min_budget || profile.max_budget) {
      if (profile.min_budget && profile.max_budget) {
        return `$${profile.min_budget.toLocaleString()} - $${profile.max_budget.toLocaleString()}`;
      } else if (profile.min_budget) {
        return `From $${profile.min_budget.toLocaleString()}`;
      } else if (profile.max_budget) {
        return `Up to $${profile.max_budget.toLocaleString()}`;
      }
    }
    return "Not specified";
  };

  return (
    <div className="space-y-6">
      <div className="border-t border-border/40 pt-6">
        <h3 className="text-lg font-semibold mb-4">Brand Collaboration Details</h3>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Partnership Goals</CardTitle>
              <CardDescription>
                What this brand aims to achieve through creator partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.partnership_goals ? (
                <p className="whitespace-pre-wrap">{profile.partnership_goals}</p>
              ) : (
                <p className="text-muted-foreground">Not specified</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collaboration Preferences</CardTitle>
              <CardDescription>
                Types of partnerships and collaborations this brand is interested in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Collaboration Types</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.collaboration_types?.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  )) || <span className="text-muted-foreground">Not specified</span>}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Preferred Creator Niches</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_creator_niches?.map((niche) => (
                    <Badge key={niche} variant="secondary">
                      {niche}
                    </Badge>
                  )) || <span className="text-muted-foreground">Not specified</span>}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Budget Range</h4>
                <p className="text-sm">{getBudgetDisplay()}</p>
              </div>
            </CardContent>
          </Card>

          {profile.past_collaborations && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Past Collaborations</CardTitle>
                <CardDescription>
                  Previous successful partnerships and collaborations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{profile.past_collaborations}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
