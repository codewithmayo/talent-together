import { motion } from "framer-motion";
import { UserPlus, UsersRound, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up as a creator or brand",
  },
  {
    icon: UsersRound,
    title: "Match with Brands/Creators",
    description: "Use filters to find the best fit",
  },
  {
    icon: Handshake,
    title: "Connect & Collaborate",
    description: "Discuss terms & start partnerships",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center p-6"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 right-0 w-full h-[2px] bg-border -z-10 transform translate-x-1/2">
                    <div className="absolute right-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2" />
                  </div>
                )}
                
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
