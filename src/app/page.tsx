'use client'

import React from 'react';
import Link from 'next/link';
import { colors } from './styles/theme';
import FloatingEmoji from '../components/FloatingEmoji';

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

const Landing: React.FC = () => {
  const [selectedEmojis, setSelectedEmojis] = React.useState<string[]>([]);

  React.useEffect(() => {
    const shuffled = [...scrollItems].sort(() => 0.5 - Math.random());
    setSelectedEmojis(shuffled.slice(0, 2).map(item => item.emoji));
  }, []);

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
        <Link href="/userinput" className="bg-black border-2 border-black text-white text-xl py-3 px-6 rounded-full transition hover:scale-[1.02] hover:text-black hover:bg-white duration-300 inline-block">
          Compare Now
        </Link>
      </div>
    </div>
  );
};

export default Landing;