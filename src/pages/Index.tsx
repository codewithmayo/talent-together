import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Search, Sparkles, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProfileVisibilityBanner } from "@/components/profile/ProfileVisibilityBanner";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ is_public?: boolean } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_public')
            .eq('id', session.user.id)
            .single();
            
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1">
        {profile && <ProfileVisibilityBanner isPublic={profile.is_public} isDashboard={true} />}
        <Hero />
        
        {/* Features Section with Animated Images */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16 px-4">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple. Transparent. Effective.</h2>
              <p className="text-muted-foreground text-lg">
                Our platform brings together creators and brands without unnecessary complexity
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 items-center">
              <div className="space-y-8">
                <Card className="border border-border/40 bg-card/50 card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Discover Talent</h3>
                    <p className="text-muted-foreground">
                      Browse our directory of talented creators across various niches and specialties.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 bg-card/50 card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Find Brands</h3>
                    <p className="text-muted-foreground">
                      Connect with brands looking for creators who match their vision and values.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40 bg-card/50 card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Collaborate</h3>
                    <p className="text-muted-foreground">
                      Connect directly with potential partners and start creating together.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Features Showcase Section */}
              <div className="hidden lg:block">
                <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full rounded-xl overflow-hidden border border-border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  
                  {/* Blurry circles for design */}
                  <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl" />
                  
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="glass p-6 rounded-xl space-y-6 max-w-xs w-full mx-6 animate-scale-in shadow-lg">
                      <h3 className="text-xl font-semibold text-center">Platform Features</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Talent Discovery</p>
                            <p className="text-sm text-muted-foreground">Find the perfect match</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Search className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Smart Search</p>
                            <p className="text-sm text-muted-foreground">Filter by expertise</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Direct Connect</p>
                            <p className="text-sm text-muted-foreground">Start collaborating</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Discover Creators Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Discover Creators</h2>
              <p className="text-muted-foreground">
                Find and connect with talented creators from around the world who specialize in various niches and content types
              </p>
              <div className="relative w-full max-w-md mx-auto mt-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search creators by name or niche..." className="pl-9" />
              </div>
              <Button 
                className="mt-6" 
                size="lg"
                onClick={() => navigate('/creators')}
              >
                Browse All Creators
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Ready to start collaborating?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our platform today and connect with the perfect partners for your next creative project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/login?tab=signup')}>
                  Create Your Profile
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
