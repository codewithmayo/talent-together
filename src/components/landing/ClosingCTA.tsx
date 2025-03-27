import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            Join the Future of Creator Collaborations
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start Connecting with Brands & Get Sponsored Today
          </p>
          <Button size="lg" className="min-w-[200px]" asChild>
            <a href="/login?tab=signup">Sign Up for Free</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
