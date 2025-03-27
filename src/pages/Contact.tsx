import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const email = 'helptalenttogether@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate dark:prose-invert mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>
          
          <h2 className="text-2xl font-semibold mb-6">
            Have questions? We'd love to hear from you!
          </h2>
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-lg">
              <Mail className="h-6 w-6 text-primary" />
              <span>Email us at:</span>
            </div>
            
            <Button
              variant="outline"
              className="text-lg px-6 py-8 h-auto"
              onClick={handleCopyEmail}
            >
              {email}
              <span className="ml-2 text-sm text-muted-foreground">(Click to copy)</span>
            </Button>
            
            <p className="text-lg mt-8 max-w-2xl">
              For partnership inquiries, feedback, or support, reach out anytime. 
              We'll get back to you as soon as possible!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
