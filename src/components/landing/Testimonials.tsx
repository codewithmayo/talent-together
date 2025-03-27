import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Found my first brand deal within a week of joining. The direct communication makes everything so much easier!",
    author: "Sarah K.",
    role: "Lifestyle Creator",
    avatar: "/avatars/creator1.jpg",
  },
  {
    quote: "As a small business, we were struggling to find the right creators. This platform made it simple and efficient.",
    author: "Michael R.",
    role: "E-commerce Brand Owner",
    avatar: "/avatars/brand1.jpg",
  },
  {
    quote: "The engagement metrics help us make informed decisions. No more guessing about creator performance.",
    author: "Lisa M.",
    role: "Marketing Manager",
    avatar: "/avatars/brand2.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border bg-card"
              >
                <div className="mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <blockquote className="mb-4 text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <footer>
                  <cite className="not-italic font-semibold">{testimonial.author}</cite>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </footer>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
