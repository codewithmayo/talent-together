import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAbout } from "@/components/profile/ProfileAbout";
import { ProfileContactInfo } from "@/components/profile/ProfileContactInfo";
import { ProfileEngagementDisplay } from "@/components/profile/ProfileEngagementDisplay";
import { BrandProfileInfo } from "@/components/profile/BrandProfileInfo";
import { UserProfile, SocialLink } from "@/lib/supabase";
import { EngagementStats } from "@/components/profile/ProfileEngagementStats";
import { ProfileVisibilityBanner } from "@/components/profile/ProfileVisibilityBanner";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [underReview, setUnderReview] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user.id;

        if (!currentUserId) {
          navigate("/login");
          return;
        }

        let profileId = id;
        let isOwnProfile = false;

        if (!profileId) {
          profileId = currentUserId;
          isOwnProfile = true;
        } else {
          isOwnProfile = currentUserId === profileId;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);

          if (isOwnProfile) {
            navigate("/profile-edit");
            return;
          }

          setLoading(false);
          return;
        }

        if (profileData) {
          // Cast the type field and social_links to ensure correct types
          const rawData = profileData as any;
          const typedProfileData: UserProfile = {
            id: rawData.id || "",
            name: rawData.name || "",
            type: (rawData.type || "creator") as "creator" | "brand",
            bio: rawData.bio || "",
            location: rawData.location || "",
            website: rawData.website || "",
            followers_count: Number(rawData.followers_count) || 0,
            categories: Array.isArray(rawData.categories)
              ? rawData.categories
              : [],
            platforms: Array.isArray(rawData.platforms)
              ? rawData.platforms
              : [],
            social_links: Array.isArray(rawData.social_links)
              ? rawData.social_links.map((link: any) => ({
                  platform: String(link.platform || ""),
                  url: String(link.url || ""),
                  followers: Number(link.followers || 0),
                }))
              : [],
            avatar_url: rawData.avatar_url || "",
            email: rawData.email || "",
            phone: rawData.phone || "",
            preferred_contact: (rawData.preferred_contact || "email") as
              | "email"
              | "phone",
            created_at: rawData.created_at || new Date().toISOString(),
            updated_at: rawData.updated_at || new Date().toISOString(),
            engagement_stats: rawData.engagement_stats
              ? {
                  likes: Array.isArray(rawData.engagement_stats.likes)
                    ? (rawData.engagement_stats.likes as [
                        number,
                        number,
                        number,
                      ])
                    : [0, 0, 0],
                  comments: Array.isArray(rawData.engagement_stats.comments)
                    ? (rawData.engagement_stats.comments as [
                        number,
                        number,
                        number,
                      ])
                    : [0, 0, 0],
                  analyticsImage: String(
                    rawData.engagement_stats.analyticsImage || "",
                  ),
                  hideAnalytics: Boolean(
                    rawData.engagement_stats.hideAnalytics,
                  ),
                }
              : undefined,
            budget_range: rawData.budget_range || "",
            min_budget: Number(rawData.min_budget) || 0,
            max_budget: Number(rawData.max_budget) || 0,
            collaboration_types: Array.isArray(rawData.collaboration_types)
              ? rawData.collaboration_types
              : [],
            preferred_creator_niches: Array.isArray(
              rawData.preferred_creator_niches,
            )
              ? rawData.preferred_creator_niches
              : [],
            partnership_goals: rawData.partnership_goals || "",
            past_collaborations: rawData.past_collaborations || "",
            is_public: Boolean(rawData.is_public),
            under_review: Boolean(rawData.under_review),
            rejection_reason: rawData.rejection_reason || "",
          };
          setProfile(typedProfileData);
          setIsCurrentUser(isOwnProfile);
          setFollowersCount(typedProfileData.followers_count || 0);
          setUnderReview(typedProfileData.under_review || false);
        } else {
          if (isOwnProfile) {
            navigate("/profile-edit");
            return;
          } else {
            toast.error("Profile not found");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The profile you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="bg-white rounded-xl p-6 md:p-8">
            {profile.type === "creator" && (
              <ProfileVisibilityBanner
                isPublic={profile.is_public || false}
                underReview={profile.under_review || false}
                isDashboard={isCurrentUser}
                rejectionReason={profile.rejection_reason}
              />
            )}{" "}
            <ProfileHeader
              profile={profile}
              isCurrentUser={isCurrentUser}
              followersCount={followersCount}
            />
            {profile.type === "creator" && (
              <div className="mt-4 flex items-center gap-4">
                <ProfileEngagementDisplay
                  stats={profile.engagement_stats}
                  totalFollowers={followersCount}
                />
              </div>
            )}
            <Tabs defaultValue="about" className="mt-8">
              <TabsList className="grid w-full grid-cols-1 md:w-auto md:inline-grid">
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ProfileAbout
                      profile={profile}
                      followersCount={followersCount}
                    />
                    {profile.type === "brand" && (
                      <div className="mt-6">
                        <BrandProfileInfo profile={profile} />
                      </div>
                    )}
                  </div>

                  <div>
                    <ProfileContactInfo profile={profile} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
