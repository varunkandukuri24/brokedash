'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import FloatingEmoji from '@/components/FloatingEmoji';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const country = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_country='))
        ?.split('=')[1] || 'Unknown';

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, country }),
      });

      if (response.ok) {
        setMessage('Thank you for joining our waitlist!');
        setEmail('');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    const emojis = ['🍕', '🍣', '🍔', '🌮', '🥗', '🍜', '🍱', '🥡', '🍛', '🍝'];
    const shuffled = [...emojis].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 2));
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center items-center text-center relative overflow-hidden bg-lightAccent">
      {selectedEmojis.map((emoji, index) => (
        <FloatingEmoji key={index} emoji={emoji} size={40} />
      ))}
      <div className="mt-[-4rem] md:mt-0">
        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-black">
          Join our Waitlist
        </h1>
        <p className="text-base md:text-2xl mb-8 text-gray-800">
          We're excited to bring brokedash to your country soon! 🌍
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <div className="w-2/3 md:w-full max-w-md">
            <div className={`relative ${shake ? 'animate-shake' : ''}`}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-white rounded-xl p-6 border-4 ${
                  isError ? 'border-red-500' : 'border-black'
                } text-center focus:outline-none focus:ring-0 ${
                  isError ? 'focus:border-red-500' : 'focus:border-black'
                }`}
                required
                aria-invalid={isError}
                aria-describedby={isError ? "email-error" : undefined}
                autoComplete="email"
                style={{ fontSize: '16px' }}
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
                An error occurred. Please try again.
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-black border-2 border-black text-white text-xl py-3 px-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </Button>
        </form>
        {message && (
          <p className="mt-4 text-lg font-semibold text-center">{message}</p>
        )}
        <Button 
          onClick={() => router.push('/')}
          className="mt-8 bg-transparent text-black border-2 border-black hover:bg-black hover:text-white transition rounded-full py-2 px-4"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
