// This file contains the functions for interacting with Supabase
import { supabase } from "@/integrations/supabase/client";
import type { EngagementStats } from "@/components/profile/ProfileEngagementStats";

export type SocialLink = {
  platform: string;
  url: string;
  followers?: number;
};

export type UserProfile = {
  id: string;
  name: string;
  type: "creator" | "brand";
  bio?: string;
  location?: string;
  website?: string;
  followers_count?: number;
  categories?: string[];
  platforms?: string[];
  social_links?: SocialLink[];
  avatar_url?: string;
  email?: string;
  phone?: string;
  preferred_contact?: "email" | "phone";
  created_at?: string;
  updated_at?: string;
  engagement_stats?: EngagementStats;
  budget_range?: string;
  min_budget?: number;
  max_budget?: number;
  collaboration_types?: string[];
  preferred_creator_niches?: string[];
  partnership_goals?: string;
  past_collaborations?: string;
  is_public?: boolean;
  under_review?: boolean;
  approved?: boolean;
  rejection_reason?: string;
};

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

export async function getProfilesUnderReview(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("under_review", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles under review:", error);
    return [];
  }

  return data as UserProfile[];
}

// Replace the approveProfile function with this new implementation
export async function approveProfile(profileId: string): Promise<boolean> {
  console.log(`Approving profile ${profileId} using RPC...`);

  try {
    const { data, error } = await supabase.rpc("approve_profile_admin", {
      profile_id: profileId,
    });

    if (error) {
      console.error("Error approving profile with RPC:", error);
      return false;
    }

    console.log("Profile approved successfully via RPC");
    return true;
  } catch (error) {
    console.error("Error in approveProfile:", error);
    return false;
  }
}

// Replace the rejectProfile function with this new implementation
export async function rejectProfile(
  profileId: string,
  rejectionReason: string,
): Promise<boolean> {
  console.log(`Rejecting profile ${profileId} using RPC...`);

  try {
    const { data, error } = await supabase.rpc("reject_profile_admin", {
      profile_id: profileId,
      reason: rejectionReason,
    });

    if (error) {
      console.error("Error rejecting profile with RPC:", error);
      return false;
    }

    console.log("Profile rejected successfully via RPC");
    return true;
  } catch (error) {
    console.error("Error in rejectProfile:", error);
    return false;
  }
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
  if (!profile.id) {
    throw new Error("Profile ID is required for updates");
  }

  const { error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profile.id);

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return true;
}

export async function createUserProfile(
  profile: Partial<UserProfile> & {
    id: string;
    name: string;
    type: "creator" | "brand";
  },
) {
  const { error } = await supabase.from("profiles").insert(profile);

  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }

  return true;
}

// Re-export supabase client
export { supabase };
