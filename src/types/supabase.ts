export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url?: string;
          bio?: string;
          categories: string[];
          created_at: string;
          email: string;
          followers_count: number;
          location: string;
          social_links: Record<string, string>;
          type: string;
          updated_at: string;
          website: string;
          gender?: string;
          date_of_birth?: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar_url?: string;
          bio?: string;
          categories?: string[];
          email?: string;
          followers_count?: number;
          location?: string;
          social_links?: Record<string, string>;
          type: string;
          website?: string;
          gender?: string;
          date_of_birth?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string;
          bio?: string;
          categories?: string[];
          email?: string;
          followers_count?: number;
          location?: string;
          social_links?: Record<string, string>;
          type?: string;
          website?: string;
          gender?: string;
          date_of_birth?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ];
      };
      campaigns: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          description?: string;
          requirements?: string;
          content_type?: string[];
          budget_range?: string;
          min_budget?: number;
          max_budget?: number;
          payment_type?: string;
          preferred_niches?: string[];
          preferred_platforms?: string[];
          follower_range?: string;
          min_engagement_rate?: number;
          geographic_targeting?: string[];
          hashtags?: string[];
          usage_rights?: string;
          past_collaborations?: string;
          extra_notes?: string;
          contact_info?: {
            email?: string;
            social_links?: string[];
          };
          status?: string;
          start_date?: string;
          end_date?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          description?: string;
          requirements?: string;
          content_type?: string[];
          budget_range?: string;
          min_budget?: number;
          max_budget?: number;
          payment_type?: string;
          preferred_niches?: string[];
          preferred_platforms?: string[];
          follower_range?: string;
          min_engagement_rate?: number;
          geographic_targeting?: string[];
          hashtags?: string[];
          usage_rights?: string;
          past_collaborations?: string;
          extra_notes?: string;
          contact_info?: {
            email?: string;
            social_links?: string[];
          };
          status?: string;
          start_date?: string;
          end_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
