'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Waitlist() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center items-center text-center bg-lightAccent">
      <div>
        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-black">
          Brokedash Unavailable
        </h1>
        <p className="text-base md:text-2xl mb-8 text-gray-800">
          Sorry, but Brokedash is not available in your country at this time.
        </p>
        <Button 
          onClick={() => router.push('/')}
          className="mt-8 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition rounded-full py-3 px-6"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
