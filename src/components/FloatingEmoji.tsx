'use client'

import React, { useEffect, useRef } from 'react';

interface FloatingEmojiProps {
  emoji: string;
  size: number;
}

const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ emoji, size }) => {
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const emoji = emojiRef.current;
    if (!emoji) return;

    let x = Math.random() * (window.innerWidth - size);
    let y = Math.random() * (window.innerHeight - size);
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;

    const animate = () => {
      if (!emoji) return;

      x += dx;
      y += dy;

      const navbarHeight = 52;

      // Adjust the boundaries to account for the navbar
      if (x <= 0 || x >= window.innerWidth - size) dx = -dx;
      if (y <= navbarHeight || y >= window.innerHeight - size) dy = -dy;

      // Ensure the emoji doesn't go above the navbar
      y = Math.max(y, navbarHeight);

    
      emoji.style.left = `${x}px`;
      emoji.style.top = `${y}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }, [size]);

  return (
    <div
      ref={emojiRef}
      className="absolute"
      style={{
        fontSize: `${size}px`,
        transition: 'all 0.1s linear'
      }}
    >
      {emoji}
    </div>
  );
};

export default FloatingEmoji;