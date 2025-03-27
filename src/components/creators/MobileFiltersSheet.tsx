import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileFiltersSheetProps {
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

export function MobileFiltersSheet({
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
}: MobileFiltersSheetProps) {
  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedFollowerRanges.length > 0 || 
    selectedEngagementRates.length > 0 || 
    selectedPlatforms.length > 0;

  const activeFiltersCount = selectedCategories.length + 
    selectedFollowerRanges.length + 
    selectedEngagementRates.length + 
    selectedPlatforms.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          <div className="space-y-6 pr-4">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mobile-category-${category}`} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label 
                      htmlFor={`mobile-category-${category}`}
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
                      id={`mobile-follower-${range.label}`} 
                      checked={selectedFollowerRanges.includes(range.label)}
                      onCheckedChange={() => toggleFollowerRange(range.label)}
                    />
                    <Label 
                      htmlFor={`mobile-follower-${range.label}`}
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
                      id={`mobile-engagement-${rate.label}`} 
                      checked={selectedEngagementRates.includes(rate.label)}
                      onCheckedChange={() => toggleEngagementRate(rate.label)}
                    />
                    <Label 
                      htmlFor={`mobile-engagement-${rate.label}`}
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
                      id={`mobile-platform-${platform}`} 
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label 
                      htmlFor={`mobile-platform-${platform}`}
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
      </SheetContent>
    </Sheet>
  );
}
