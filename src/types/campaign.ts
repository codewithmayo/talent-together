export interface Brand {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  requirements: string;
  content_type: string[];
  budget_range: string;
  min_budget: number;
  max_budget: number;
  payment_type: string;
  preferred_niches: string[];
  preferred_platforms: string[];
  follower_range: string;
  min_engagement_rate: number;
  geographic_targeting: string[];
  hashtags: string[];
  usage_rights: string;
  past_collaborations: string;
  extra_notes: string;
  contact_info: {
    email?: string;
    social_links?: string[];
  };
  status: string;
  start_date: string;
  end_date: string;
  brand: Brand;
}
