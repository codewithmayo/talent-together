import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8 text-center">About Us</h1>
          
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome to Talent-Together!</h2>
          
          <div className="space-y-6 text-lg">
            <p>
              At Talent-Together, we believe that every creator deserves an opportunity to grow and collaborate. 
              Our platform connects small creators with brands looking for genuine partnerships, making it easier 
              for talented individuals to find sponsorships and business opportunities.
            </p>
            
            <p>
              We know how hard it is for creators to get noticed in a crowded digital space. That's why we built 
              Talent-Together—to create a space where brands and creators can connect seamlessly, without 
              unnecessary barriers.
            </p>
            
            <p>
              Whether you're an influencer looking for sponsorships or a brand seeking passionate creators, 
              Talent-Together is here to bridge the gap.
            </p>
            
            <p className="text-xl font-semibold text-center mt-12">
              Join us today and start growing together!
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <a 
              href="/login" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
