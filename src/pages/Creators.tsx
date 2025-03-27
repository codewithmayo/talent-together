import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreatorsFilterSidebar } from "@/components/creators/CreatorsFilterSidebar";
import { MobileFiltersSheet } from "@/components/creators/MobileFiltersSheet";
import { CreatorsSearchBar } from "@/components/creators/CreatorsSearchBar";
import { creatorCategories } from "@/lib/categories";

const FOLLOWER_RANGES = [
  { label: "1K-10K", min: 1000, max: 10000 },
  { label: "10K-50K", min: 10000, max: 50000 },
  { label: "50K-100K", min: 50000, max: 100000 },
  { label: "100K-500K", min: 100000, max: 500000 },
  { label: "500K+", min: 500000, max: null },
];

const ENGAGEMENT_RATES = [
  { label: "Low", min: 0, max: 2 },
  { label: "Moderate", min: 2, max: 5 },
  { label: "High", min: 5, max: 10 },
  { label: "Viral", min: 10, max: null },
];

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter", "LinkedIn"];

interface Creator {
  id: string;
  name: string;
  type: 'creator';
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  followers_count?: number | null;
  categories?: string[] | null;
  platforms?: string[] | null;
  avatar_url?: string | null;
  is_public: boolean;
  created_at?: string | null;
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFollowerRanges, setSelectedFollowerRanges] = useState<string[]>([]);
  const [selectedEngagementRates, setSelectedEngagementRates] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, type, bio, location, website, followers_count, categories, platforms, avatar_url, is_public, created_at')
          .eq('type', 'creator')
          .eq('is_public', true)
          .returns<Creator[]>();
        
        if (error) throw error;
        
        if (data) {
          setCreators(data);
          setFilteredCreators(data);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        toast.error('Failed to load creators');
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    // Apply filters
    let results = creators;
    
    if (searchQuery) {
      results = results.filter(creator => 
        creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      results = results.filter(creator => 
        creator.categories?.some(category => selectedCategories.includes(category))
      );
    }

    // Filter by follower ranges
    if (selectedFollowerRanges.length > 0) {
      results = results.filter(creator => {
        const followersCount = creator.followers_count || 0;
        return selectedFollowerRanges.some(range => {
          const { min, max } = FOLLOWER_RANGES.find(r => r.label === range)!;
          return followersCount >= min && (max === null || followersCount <= max);
        });
      });
    }

    // Filter by engagement rates
    if (selectedEngagementRates.length > 0) {
      results = results.filter(creator => {
        if (!creator.followers_count) return false;
        
        const engagementRate = 0; // Replace with actual engagement rate calculation
        
        return selectedEngagementRates.some(rate => {
          const { min, max } = ENGAGEMENT_RATES.find(r => r.label === rate)!;
          return engagementRate >= min && (max === null || engagementRate <= max);
        });
      });
    }

    // Filter by platforms
    if (selectedPlatforms.length > 0) {
      results = results.filter(creator => 
        creator.platforms?.some(platform => selectedPlatforms.includes(platform))
      );
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      results = [...results].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    } else if (sortBy === "followers") {
      results = [...results].sort((a, b) => 
        (b.followers_count || 0) - (a.followers_count || 0)
      );
    } else if (sortBy === "engagement") {
      results = [...results].sort((a, b) => {
        const getEngagementRate = (profile: any) => {
          if (!profile.followers_count) return 0;
          
          const engagementRate = 0; // Replace with actual engagement rate calculation
          
          return engagementRate;
        };
        
        return getEngagementRate(b) - getEngagementRate(a);
      });
    }
    
    setFilteredCreators(results);
  }, [creators, searchQuery, selectedCategories, selectedFollowerRanges, selectedEngagementRates, selectedPlatforms, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFollowerRange = (range: string) => {
    setSelectedFollowerRanges(prev => 
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleEngagementRate = (rate: string) => {
    setSelectedEngagementRates(prev => 
      prev.includes(rate)
        ? prev.filter(r => r !== rate)
        : [...prev, rate]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedFollowerRanges([]);
    setSelectedEngagementRates([]);
    setSelectedPlatforms([]);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Find Creators</h1>
          <CreatorsSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        
        <div className="flex gap-8">
          <CreatorsFilterSidebar 
            selectedCategories={selectedCategories}
            categories={creatorCategories}
            toggleCategory={toggleCategory}
            followerRanges={FOLLOWER_RANGES}
            selectedFollowerRanges={selectedFollowerRanges}
            toggleFollowerRange={toggleFollowerRange}
            engagementRates={ENGAGEMENT_RATES}
            selectedEngagementRates={selectedEngagementRates}
            toggleEngagementRate={toggleEngagementRate}
            platforms={PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            clearFilters={clearFilters}
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <MobileFiltersSheet 
                selectedCategories={selectedCategories}
                categories={creatorCategories}
                toggleCategory={toggleCategory}
                followerRanges={FOLLOWER_RANGES}
                selectedFollowerRanges={selectedFollowerRanges}
                toggleFollowerRange={toggleFollowerRange}
                engagementRates={ENGAGEMENT_RATES}
                selectedEngagementRates={selectedEngagementRates}
                toggleEngagementRate={toggleEngagementRate}
                platforms={PLATFORMS}
                selectedPlatforms={selectedPlatforms}
                togglePlatform={togglePlatform}
                clearFilters={clearFilters}
              />
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="h-[300px] bg-muted rounded-lg mb-4" />
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCreators.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No creators found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCreators.map((creator) => (
                  <ProfileCard key={creator.id} profile={creator} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Creators;
