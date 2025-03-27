import { motion } from "framer-motion";
import { Search, Filter, MessageSquare, Wallet } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find Brand Deals Easily",
    description: "Get sponsorships without middlemen",
  },
  {
    icon: Filter,
    title: "Filter & Match Perfectly",
    description: "Brands find creators based on niche, engagement, and followers",
  },
  {
    icon: MessageSquare,
    title: "Direct Collaboration",
    description: "Message and negotiate without agencies taking a cut",
  },
  {
    icon: Wallet,
    title: "Free for all",
    description: "No upfront fees, only connections",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use This Platform?</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start p-6 rounded-lg border bg-card"
              >
                <div className="mr-4 p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
