import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container px-4 mx-auto"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            Find Brand Deals<span className="text-primary">.</span> Get Sponsored<span className="text-primary">.</span> Grow Your Influence<span className="text-primary">.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground"
          >
            The ultimate platform where small creators and brands connect for sponsorships. 
            No middlemen, no hassle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 mb-12 sm:flex-row"
          >
            <Button size="lg" className="min-w-[200px]" asChild>
              <a href="/login?tab=signup">Get Started for Free</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto"
          >
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">For Creators</h3>
              <p className="text-muted-foreground">Find sponsorships & get paid</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">For Brands</h3>
              <p className="text-muted-foreground">Discover pre-vetted influencers</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
