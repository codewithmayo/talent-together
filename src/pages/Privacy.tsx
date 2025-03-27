import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Privacy() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: March 23, 2025</p>

          <div className="space-y-8">
            <div>
              <p className="text-lg">
                At Talent-Together, we value your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  When you sign up, we collect your name, email, social media links, and any other details you 
                  provide in your profile.
                </li>
                <li>
                  We collect usage data to improve the platform, such as interactions with other users.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To display your profile on Talent-Together.</li>
                <li>To connect you with potential brand or creator collaborations.</li>
                <li>To improve our services and provide customer support.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not sell or share your personal data with third parties without your consent.</li>
                <li>We use secure servers and encryption to protect your data.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You can request to delete your data by contacting us at{' '}
                  <button 
                    onClick={handleCopyEmail}
                    className="text-primary hover:underline focus:outline-none"
                  >
                    {email}
                  </button>
                  .
                </li>
                <li>You can update your profile information at any time.</li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-muted-foreground">
                By using Talent-Together, you agree to this Privacy Policy. We may update it occasionally, 
                and continued use of the platform means you accept any changes.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
