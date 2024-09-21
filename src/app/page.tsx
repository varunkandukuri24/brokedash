'use client'

import React, { Suspense } from 'react';
import { Input } from "@/components/ui/input"
import FloatingEmoji from '../components/FloatingEmoji';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { posthog } from '@/lib/posthog';

const scrollItems = [
  { emoji: '🍕', amount: '$150', status: 'Takeout tycoon in training' },
  { emoji: '🍣', amount: '$200', status: "Delivery driver's best friend" },
  { emoji: '🍔', amount: '$100', status: 'Takeout tycoon in training' },
  { emoji: '🌮', amount: '$80', status: 'Wallet whisperer' },
  { emoji: '🥗', amount: '$30', status: 'Frugal maestro!' },
  { emoji: '🍜', amount: '$120', status: 'Noodle ninja' },
  { emoji: '🍱', amount: '$90', status: 'Bento box boss' },
  { emoji: '🥡', amount: '$60', status: 'Takeout taster' },
  { emoji: '🍛', amount: '$110', status: 'Curry connoisseur' },
  { emoji: '🍝', amount: '$70', status: 'Pasta patron' },
];

function LandingContent() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedEmojis, setSelectedEmojis] = React.useState<string[]>([]);
  const [email, setEmail] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [shake, setShake] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  React.useEffect(() => {
    const shuffled = [...scrollItems].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 2).map(item => item.emoji));
  }, []);

  const handleCompareNow = () => {
    router.push('/userinput');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setEmail('');
        setIsError(false);
      }, 2000);
    } else {
      setIsSubmitting(true);
      const redirectUrl = process.env.NEXT_PUBLIC_APP_ENV_NEW === 'production'
        ? process.env.NEXT_PUBLIC_REDIRECT_URL_PROD_NEW
        : process.env.NEXT_PUBLIC_REDIRECT_URL_DEV; // For debugging

      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectUrl ? `${redirectUrl}${referralCode ? `?ref=${referralCode}` : ''}` : undefined,
        },
      });
      if (error) {
        setIsError(true);
        setShake(true);
        if (error.status === 429) {
          setErrorMessage("Too many concurrent users, try again later.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        setTimeout(() => {
          setShake(false);
          setEmail('');
          setIsError(false);
          setErrorMessage("");
        }, 2000);
        setIsSubmitting(false);
      } else {
        console.log('Magic link sent to:', email);
        setEmailSent(true);
        // Track successful email submission
        posthog.capture('email_submitted', { email });
      }
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center md:justify-center items-center text-center relative overflow-hidden bg-lightAccent">
      {selectedEmojis.map((emoji, index) => (
        <FloatingEmoji key={index} emoji={emoji} size={40} />
      ))}
      <div className="mt-[-4rem] md:mt-0">
        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-black">
          See who spends 💸 <br/> more on fo🥘d delivery than you
        </h1>
        <p className="text-base md:text-2xl mb-8 text-gray-800">
          Find your place in the food chain 🦁
        </p>
        {user ? (
          <>
            <p className="text-xl mb-8 text-black">👋 Hi, {user.email}</p>
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={handleCompareNow}
                className="bg-black border-2 border-black text-white text-xl p-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
              >
                Compare Now
              </Button>
              <a 
                onClick={handleSignOut}
                className="font-bold text-black underline cursor-pointer"
              >
                Sign Out
              </a>
            </div>
          </>
        ) : emailSent ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl mb-4 text-black">Check your email 📧</p>
            <p className="text-base mb-8 text-gray-800 w-2/3">
              We sent you an email for verification. Please check your inbox and click the link to continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <div className="w-2/3 md:w-full max-w-md">
              <div className={`relative ${shake ? 'animate-shake' : ''}`}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleInputChange}
                  className={`w-full bg-white rounded-xl p-6 border-4 ${
                    isError ? 'border-red-500' : 'border-black'
                  } text-center focus:outline-none focus:ring-0 ${
                    isError ? 'focus:border-red-500' : 'focus:border-black'
                  }`}
                  required
                  aria-invalid={isError}
                  aria-describedby={isError ? "email-error" : undefined}
                  autoComplete="email" // Add this line
                  style={{ fontSize: '16px' }} // Add this line
                />
                <div 
                  className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
                    isError ? 'focus-within:shadow-[0_0_0_2px_#ef4444]' : 'focus-within:shadow-[0_0_0_2px_black]'
                  }`} 
                  aria-hidden="true" 
                />
              </div>
              {isError && (
                <p id="email-error" className="mt-2 text-red-500 text-sm">
                  {errorMessage || "Please enter a valid email address"}
                </p>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-black border-2 border-black text-white text-xl py-3 px-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Compare Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}