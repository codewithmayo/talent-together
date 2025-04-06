"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { approveProfile, rejectProfile } from "@/lib/supabase";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import type { UserProfile } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ProfilesUnderReview = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [profileDetailsOpen, setProfileDetailsOpen] = useState(false);
  // Add a state to track profiles that failed to update in the database
  const [failedUpdates, setFailedUpdates] = useState<{
    [key: string]: { action: "approve" | "reject"; reason?: string };
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Error checking auth:", error);
        setLoading(false);
        navigate("/login");
        return;
      }

      setUser(session.user);

      // Check if user is admin (you'll need to implement this logic based on your app's requirements)
      // For example, you might have a separate "admins" table or a field in the profiles table
      // This is a placeholder implementation
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Placeholder: Check if user has admin role
      // Replace this with your actual admin check logic
      const userIsAdmin =
        profileData?.type === "admin" ||
        session.user.email?.endsWith("@yourdomain.com");

      if (!userIsAdmin) {
        toast.error("You don't have permission to access this page");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchProfiles();
    };

    checkAuth();
  }, [navigate]);

  // Modify the fetchProfiles function to handle the case where profiles might still be in the database
  // but should be filtered out based on our client-side tracking:

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      console.log("Fetching profiles under review...");

      // Fetch directly from supabase with explicit filter
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("under_review", true)
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log(`Found ${data?.length || 0} profiles under review:`, data);

      // Filter out profiles that failed to update but we're tracking in state
      const filteredData = data.filter((profile) => !failedUpdates[profile.id]);

      console.log(
        `After filtering failed updates: ${filteredData.length} profiles remaining`,
      );
      setProfiles(filteredData as UserProfile[]);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles under review");
    } finally {
      setLoading(false);
    }
  };

  // Update the handleApprove function to try database updates first, then fall back to client-side tracking
  const handleApprove = async (profileId: string) => {
    setProcessingIds((prev) => [...prev, profileId]);
    try {
      console.log(`Starting approval process for profile ${profileId}`);

      // Try to update the database
      const success = await approveProfile(profileId);

      if (!success) {
        console.log(
          "Database update failed. Using client-side tracking as fallback...",
        );

        // Add this profile to our failed updates tracking
        setFailedUpdates((prev) => ({
          ...prev,
          [profileId]: { action: "approve" },
        }));

        toast.warning("Profile marked as approved (database update pending)");
      } else {
        console.log(`Profile ${profileId} successfully approved in database`);
        toast.success("Profile approved successfully");
      }

      // Remove the profile from the list in either case
      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));
    } catch (error) {
      console.error("Error approving profile:", error);
      toast.error("An error occurred while approving the profile");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== profileId));
    }
  };

  // Update the handleReject function with similar approach
  const handleReject = async () => {
    if (!selectedProfile) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessingIds((prev) => [...prev, selectedProfile.id]);
    try {
      console.log(
        `Starting rejection process for profile ${selectedProfile.id}`,
      );

      // Try to update the database
      const success = await rejectProfile(selectedProfile.id, rejectionReason);

      if (!success) {
        console.log(
          "Database update failed. Using client-side tracking as fallback...",
        );

        // Add this profile to our failed updates tracking
        setFailedUpdates((prev) => ({
          ...prev,
          [selectedProfile.id]: {
            action: "reject",
            reason: rejectionReason,
          },
        }));

        toast.warning("Profile marked as rejected (database update pending)");
      } else {
        console.log(
          `Profile ${selectedProfile.id} successfully rejected in database`,
        );
        toast.success("Profile rejected successfully");
      }

      // Remove the profile from the list in either case
      setProfiles((prev) =>
        prev.filter((profile) => profile.id !== selectedProfile.id),
      );

      setRejectionDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting profile:", error);
      toast.error("An error occurred while rejecting the profile");
    } finally {
      setProcessingIds((prev) =>
        prev.filter((id) => id !== selectedProfile.id),
      );
    }
  };

  // Modify the retryFailedUpdates function to be more robust:

  const retryFailedUpdates = async () => {
    const failedIds = Object.keys(failedUpdates);
    if (failedIds.length === 0) return;

    toast.info(`Retrying ${failedIds.length} pending updates...`);

    let successCount = 0;

    for (const profileId of failedIds) {
      const { action, reason } = failedUpdates[profileId];

      try {
        setProcessingIds((prev) => [...prev, profileId]);
        let success = false;

        if (action === "approve") {
          success = await approveProfile(profileId);
        } else if (action === "reject" && reason) {
          success = await rejectProfile(profileId, reason);
        }

        if (success) {
          console.log(`Successfully updated profile ${profileId} in database`);
          // Remove from failed updates
          setFailedUpdates((prev) => {
            const newState = { ...prev };
            delete newState[profileId];
            return newState;
          });
          successCount++;
        } else {
          console.log(`Update still failed for profile ${profileId}`);
        }
      } catch (error) {
        console.error(`Error retrying update for profile ${profileId}:`, error);
      } finally {
        setProcessingIds((prev) => prev.filter((id) => id !== profileId));
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully updated ${successCount} profiles`);
    }

    const remainingFailed = Object.keys(failedUpdates).length;
    if (remainingFailed === 0) {
      toast.success("All pending updates completed successfully");
    } else {
      toast.warning(`${remainingFailed} updates still pending`);
    }

    // Refresh the list to make sure we're showing the current state
    fetchProfiles();
  };

  const openRejectDialog = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setRejectionReason("");
    setRejectionDialogOpen(true);
  };

  const openProfileDetails = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setProfileDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container max-w-4xl py-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This should never happen due to the redirect in useEffect
  }

  const pendingUpdatesCount = Object.keys(failedUpdates).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Profiles Under Review</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve creator profiles
            </p>
          </div>
          <div className="flex gap-2">
            {pendingUpdatesCount > 0 && (
              <Button
                variant="outline"
                onClick={retryFailedUpdates}
                size="sm"
                className="flex items-center gap-1"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Retry {pendingUpdatesCount} Pending
              </Button>
            )}
            <Button variant="outline" onClick={fetchProfiles}>
              Refresh
            </Button>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">
              No profiles to review
            </h2>
            <p className="text-muted-foreground mt-2">
              There are currently no profiles waiting for review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.name}
                    />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle>{profile.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            profile.updated_at || "",
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <CardDescription>
                      {profile.location && `${profile.location} • `}
                      {profile.followers_count &&
                        `${profile.followers_count.toLocaleString()} followers`}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.bio && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Bio</h3>
                        <p className="text-sm text-muted-foreground">
                          {profile.bio}
                        </p>
                      </div>
                    )}

                    {profile.categories && profile.categories.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Categories</h3>
                        <div className="flex flex-wrap gap-1">
                          {profile.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.platforms && profile.platforms.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Platforms</h3>
                        <div className="flex flex-wrap gap-1">
                          {profile.platforms.map((platform) => (
                            <Badge key={platform} variant="outline">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openProfileDetails(profile)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openRejectDialog(profile)}
                    disabled={processingIds.includes(profile.id)}
                  >
                    {processingIds.includes(profile.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(profile.id)}
                    disabled={processingIds.includes(profile.id)}
                  >
                    {processingIds.includes(profile.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Profile</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this profile. This will be
              shown to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please explain why this profile is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={processingIds.includes(selectedProfile?.id || "")}
            >
              {processingIds.includes(selectedProfile?.id || "") ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Details Dialog */}
      <Dialog open={profileDetailsOpen} onOpenChange={setProfileDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedProfile?.name}'s profile
            </DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="py-4 space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedProfile.avatar_url || undefined}
                    alt={selectedProfile.name}
                  />
                  <AvatarFallback>
                    {selectedProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedProfile.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedProfile.location || "No location provided"}
                  </p>
                  <p className="text-sm">
                    Profile updated:{" "}
                    {new Date(
                      selectedProfile.updated_at || "",
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Bio: </span>
                      <p className="text-muted-foreground">
                        {selectedProfile.bio || "No bio provided"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Email: </span>
                      <span>
                        {selectedProfile.email || "No email provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Phone: </span>
                      <span>
                        {selectedProfile.phone || "No phone provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Website: </span>
                      <span>
                        {selectedProfile.website || "No website provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Preferred Contact: </span>
                      <span>
                        {selectedProfile.preferred_contact || "Email"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Creator Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Followers: </span>
                      <span>
                        {selectedProfile.followers_count?.toLocaleString() ||
                          "0"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Categories: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProfile.categories &&
                        selectedProfile.categories.length > 0 ? (
                          selectedProfile.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No categories selected
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Platforms: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProfile.platforms &&
                        selectedProfile.platforms.length > 0 ? (
                          selectedProfile.platforms.map((platform) => (
                            <Badge key={platform} variant="outline">
                              {platform}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No platforms selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProfile.social_links &&
                selectedProfile.social_links.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Social Media Links
                    </h3>
                    <div className="space-y-2">
                      {selectedProfile.social_links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-medium">{link.platform}: </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.url}
                          </a>
                          {link.followers && (
                            <span className="text-sm text-muted-foreground">
                              ({link.followers.toLocaleString()} followers)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProfileDetailsOpen(false);
                openRejectDialog(selectedProfile!);
              }}
            >
              Reject Profile
            </Button>
            <Button
              onClick={() => {
                setProfileDetailsOpen(false);
                handleApprove(selectedProfile!.id);
              }}
              disabled={processingIds.includes(selectedProfile?.id || "")}
            >
              Approve Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfilesUnderReview;
