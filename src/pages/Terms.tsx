import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Terms() {
  const email = 'helptalenttogether@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate dark:prose-invert mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: March 23, 2025</p>

          <div className="space-y-8">
            <p className="text-lg">
              Welcome to Talent-Together! By using our platform, you agree to the following terms:
            </p>

            <div>
              <h2 className="text-2xl font-semibold mb-4">1. What We Do</h2>
              <p>
                Talent-Together is a platform that connects brands with creators for collaborations and sponsorships.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. User Guidelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate information in your profile.</li>
                <li>You agree not to spam, harass, or mislead other users.</li>
                <li>You are responsible for your interactions with other users.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Content & Ownership</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You retain ownership of the content you post but grant us permission to display it on Talent-Together.
                </li>
                <li>
                  We reserve the right to remove any content that violates our guidelines.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Disclaimer & Liability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Talent-Together is not responsible for any deals, payments, or agreements made between creators and brands.
                </li>
                <li>
                  We do not guarantee the success of any collaboration.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Account Termination</h2>
              <p>
                We reserve the right to suspend or remove accounts that violate our policies.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p>
                By using Talent-Together, you agree to these Terms of Service. If you have questions, contact us at{' '}
                <button 
                  onClick={handleCopyEmail}
                  className="text-primary hover:underline focus:outline-none"
                >
                  {email}
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
