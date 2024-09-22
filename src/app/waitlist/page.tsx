'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-lightAccent">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-black text-center">
        Join our Waitlist
      </h1>
      <p className="text-xl mb-8 text-gray-800 text-center max-w-2xl">
        We're excited to bring our service to your country soon! Join our waitlist to be notified when we launch.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-6 text-lg"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-black text-white text-xl p-6 rounded-full transition hover:bg-white hover:text-black"
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </Button>
        </div>
      </form>
      {message && (
        <p className="mt-4 text-lg font-semibold text-center">{message}</p>
      )}
      <Button 
        onClick={() => router.push('/')}
        className="mt-8 bg-transparent text-black border-2 border-black hover:bg-black hover:text-white transition"
      >
        Back to Home
      </Button>
    </div>
  );
}
