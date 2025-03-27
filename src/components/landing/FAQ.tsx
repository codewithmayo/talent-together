import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this free for creators?",
    answer: "Yes! Creators can join & find brands for free.",
  },
  {
    question: "How do brands find creators?",
    answer: "They use filters like engagement rate & niche to find the perfect match for their campaigns.",
  },
  {
    question: "What types of brands are on the platform?",
    answer: "Small businesses, e-commerce brands, and startups looking to collaborate with creators.",
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up, create your profile, and start connecting with potential partners!",
  },
  {
    question: "Is there a minimum follower requirement?",
    answer: "No! We welcome creators of all sizes. We focus on engagement and authenticity.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
