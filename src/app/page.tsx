'use client'

import React from 'react';
import { Input } from "@/components/ui/input"
import FloatingEmoji from '../components/FloatingEmoji';
import { supabase } from '@/lib/supabase'; // Import Supabase client

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

export default function Landing() {
  const [selectedEmojis, setSelectedEmojis] = React.useState<string[]>([]);
  const [email, setEmail] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  React.useEffect(() => {
    const shuffled = [...scrollItems].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 2).map(item => item.emoji));
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
        },
      });
      if (error) {
        setIsError(true);
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setEmail('');
          setIsError(false);
        }, 2000);
      } else {
        console.log('Magic link sent to:', email);
        // Optionally, show a success message to the user
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center md:justify-center items-center text-center p-4 relative overflow-hidden bg-lightAccent">
      {selectedEmojis.map((emoji, index) => (
        <FloatingEmoji key={index} emoji={emoji} size={40} />
      ))}
      <div className="mt-[-4rem] md:mt-0">
        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-black">
          see who spends 💸 <br/> more on fo🥘d delivery than you
        </h1>
        <p className="text-base md:text-2xl mb-8 text-gray-800">
          find your place in the food delivery chain 🦁
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
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
                Please enter a valid email address
              </p>
            )}
          </div>
          <button type="submit" className="bg-black border-2 border-black text-white text-xl py-3 px-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300">
            Compare Now
          </button>
        </form>
      </div>
    </div>
  );
}