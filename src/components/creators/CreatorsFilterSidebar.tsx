import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatorsFilterSidebarProps {
  selectedCategories: string[];
  categories: string[];
  toggleCategory: (category: string) => void;
  followerRanges: Array<{ label: string; min: number; max: number | null }>;
  selectedFollowerRanges: string[];
  toggleFollowerRange: (range: string) => void;
  engagementRates: Array<{ label: string; min: number; max: number | null }>;
  selectedEngagementRates: string[];
  toggleEngagementRate: (rate: string) => void;
  platforms: string[];
  selectedPlatforms: string[];
  togglePlatform: (platform: string) => void;
  clearFilters: () => void;
}

export function CreatorsFilterSidebar({
  selectedCategories,
  categories,
  toggleCategory,
  followerRanges,
  selectedFollowerRanges,
  toggleFollowerRange,
  engagementRates,
  selectedEngagementRates,
  toggleEngagementRate,
  platforms,
  selectedPlatforms,
  togglePlatform,
  clearFilters
}: CreatorsFilterSidebarProps) {
  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedFollowerRanges.length > 0 || 
    selectedEngagementRates.length > 0 || 
    selectedPlatforms.length > 0;

  return (
    <div className="hidden lg:block w-64 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              Clear all
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Follower Count */}
            <div>
              <h4 className="text-sm font-medium mb-3">Follower Count</h4>
              <div className="space-y-2">
                {followerRanges.map((range) => (
                  <div key={range.label} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`follower-${range.label}`} 
                      checked={selectedFollowerRanges.includes(range.label)}
                      onCheckedChange={() => toggleFollowerRange(range.label)}
                    />
                    <Label 
                      htmlFor={`follower-${range.label}`}
                      className="text-sm cursor-pointer"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Rate */}
            <div>
              <h4 className="text-sm font-medium mb-3">Engagement Rate</h4>
              <div className="space-y-2">
                {engagementRates.map((rate) => (
                  <div key={rate.label} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`engagement-${rate.label}`} 
                      checked={selectedEngagementRates.includes(rate.label)}
                      onCheckedChange={() => toggleEngagementRate(rate.label)}
                    />
                    <Label 
                      htmlFor={`engagement-${rate.label}`}
                      className="text-sm cursor-pointer"
                    >
                      {rate.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <h4 className="text-sm font-medium mb-3">Platforms</h4>
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`platform-${platform}`} 
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label 
                      htmlFor={`platform-${platform}`}
                      className="text-sm cursor-pointer"
                    >
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
