import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase, UserProfile } from "@/lib/supabase";
import { Filter, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { brandCategories } from "@/lib/categories";

const Brands = () => {
  const [brands, setBrands] = useState<UserProfile[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('type', 'brand')
          .eq('is_public', true);
        
        if (error) throw error;
        
        if (data) {
          setBrands(data as UserProfile[]);
          setFilteredBrands(data as UserProfile[]);
        } else {
          setBrands([]);
          setFilteredBrands([]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    // Apply filters
    let results = brands;
    
    if (searchQuery) {
      results = results.filter(brand => 
        brand.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedIndustries.length > 0) {
      results = results.filter(brand => 
        brand.categories?.some(category => selectedIndustries.includes(category))
      );
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      results = [...results].sort((a, b) => 
        new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
      );
    } else if (sortBy === "alphabetical") {
      results = [...results].sort((a, b) => 
        (a.name || "").localeCompare(b.name || "")
      );
    }
    
    setFilteredBrands(results);
  }, [brands, searchQuery, selectedIndustries, sortBy]);

  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustries([]);
    setSortBy("newest");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 py-10">
        <div className="container px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Brands</h1>
            <p className="text-muted-foreground">Discover brands looking for talented creators like you</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-64 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  {selectedIndustries.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Industry</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {brandCategories.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`industry-${industry}`} 
                            checked={selectedIndustries.includes(industry)}
                            onCheckedChange={() => toggleIndustry(industry)}
                          />
                          <Label 
                            htmlFor={`industry-${industry}`}
                            className="text-sm cursor-pointer"
                          >
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, industry, or location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3">Industry</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {brandCategories.map((industry) => (
                              <div key={industry} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`mobile-industry-${industry}`} 
                                  checked={selectedIndustries.includes(industry)}
                                  onCheckedChange={() => toggleIndustry(industry)}
                                />
                                <Label 
                                  htmlFor={`mobile-industry-${industry}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {industry}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-4">
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            Clear all
                          </Button>
                          <Button size="sm">Apply Filters</Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedIndustries.map(industry => (
                    <Badge key={industry} variant="secondary" className="px-2 py-1">
                      {industry}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1" 
                        onClick={() => toggleIndustry(industry)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredBrands.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No brands found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {filteredBrands.slice(0, 4).map((profile) => (
                    <div key={profile.id} className="h-full">
                      <ProfileCard profile={profile} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Brands;
