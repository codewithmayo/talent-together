import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

export default function FAQ() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-8">
            Frequently Asked Questions (FAQ) – Talent-Together
          </h1>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. What is Talent-Together?</h3>
              <p>
                Talent-Together is a platform that helps small creators and brands connect for sponsorships 
                and collaborations. Whether you're an influencer looking for brand deals or a company seeking 
                authentic creators, our platform makes it easy to find the right partnerships.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. How do I sign up?</h3>
              <p>
                Signing up is simple! Click on Sign Up, enter your details, and create your profile. Once done, 
                you can list yourself as a creator or brand and start exploring potential collaborations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. How does Talent-Together verify users?</h3>
              <p>
                To ensure authenticity, we use a combination of profile vetting and engagement analysis. While 
                we don't require official documents, we check social media links, follower counts, and other 
                credibility factors to keep the platform high-quality.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">4. Is Talent-Together free to use?</h3>
              <p>
                Yes! Listing yourself on Talent-Together is completely free. We may introduce premium features 
                in the future, but the core matchmaking and browsing features remain free for all users.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">5. How do I find brands or creators to work with?</h3>
              <p>
                Once you create a profile, you can browse available creators or brands using filters and categories. 
                You can also sort listings based on engagement, niche, or relevance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">6. How do collaborations work?</h3>
              <p>
                Creators and brands can reach out to each other through the contact details provided in their 
                profiles. Once a connection is made, it's up to both parties to discuss terms, payments (if any), 
                and the nature of the collaboration.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">7. Does Talent-Together take a commission from deals?</h3>
              <p>
                No, we do not take any commission. Any payments or sponsorships negotiated between creators and 
                brands happen outside the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">8. How can I edit my profile?</h3>
              <p>
                You can update your profile details anytime by logging in and navigating to the Profile Settings section.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">9. Can I delete my account?</h3>
              <p>
                Yes, if you want to delete your account, you can do so in Account Settings, or you can contact us at{' '}
                <button 
                  onClick={handleCopyEmail}
                  className="text-primary hover:underline focus:outline-none"
                >
                  {email}
                </button>
                , and we'll process your request.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">10. How can I report fake or spam accounts?</h3>
              <p>
                If you come across suspicious or spam accounts, please report them using the Report button on the 
                profile or email us at{' '}
                <button 
                  onClick={handleCopyEmail}
                  className="text-primary hover:underline focus:outline-none"
                >
                  {email}
                </button>
                . We take such reports seriously and will investigate accordingly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">11. I have a question that's not listed here. How do I contact support?</h3>
              <p>
                We're happy to help! Send us an email at{' '}
                <button 
                  onClick={handleCopyEmail}
                  className="text-primary hover:underline focus:outline-none"
                >
                  {email}
                </button>
                , and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
