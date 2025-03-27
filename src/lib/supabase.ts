import { supabase } from "@/integrations/supabase/client";
import { EngagementStats } from "@/components/profile/ProfileEngagementStats";

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
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
  if (!profile.id) {
    throw new Error('Profile ID is required for updates');
  }

  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', profile.id);
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return true;
}

export async function createUserProfile(profile: Partial<UserProfile> & { id: string; name: string; type: 'creator' | 'brand' }) {
  const { error } = await supabase
    .from('profiles')
    .insert(profile);
  
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return true;
}

// Re-export supabase client
export { supabase };
