import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" aria-hidden="true" />
      
      <div className="container relative px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
          <div className={`space-y-8 transition-all duration-700 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-4">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm animate-fade-in">
                Now in Beta
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Connect<span className="text-primary">.</span> Create<span className="text-primary">.</span> <br className="hidden md:inline"/> Collaborate<span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Bringing together small creators and brands in one elegant platform
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/creators')} className="group">
                Find Creators
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/brands')}>
                Browse Brands
              </Button>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <span className="font-medium text-foreground">500+</span> creators and brands
                </p>
              </div>
            </div>
          </div>
          
          <div className={`relative transition-all duration-700 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full rounded-xl overflow-hidden border border-border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
              
              {/* Blurry circles for design */}
              <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl" />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="glass p-6 rounded-xl space-y-4 max-w-xs w-full mx-6 animate-scale-in shadow-lg">
                  <h3 className="text-2xl font-semibold text-center">Connect & Create</h3>
                  <p className="text-center text-muted-foreground">
                    Find the perfect collaboration opportunities for your brand or creative journey
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => navigate('/creators')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
