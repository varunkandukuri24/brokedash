'use client'

import React, { useEffect, useRef } from 'react';

interface FloatingEmojiProps {
  emoji: string;
  size: number;
}

const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ emoji, size }) => {
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const emojiElement = emojiRef.current;
    if (!emojiElement) return;

    let x = Math.random() * (window.innerWidth - size);
    let y = Math.random() * (window.innerHeight - size);
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;

    const animate = () => {
      if (!emojiElement) return;

      x += dx;
      y += dy;

      const navbarHeight = 52;

      // Adjust the boundaries to account for the navbar
      if (x <= 0 || x >= window.innerWidth - size) dx = -dx;
      if (y <= navbarHeight || y >= window.innerHeight - size) dy = -dy;

      // Ensure the emoji doesn't go above the navbar
      y = Math.max(y, navbarHeight);

      emojiElement.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(animate);
    };

    animate();
  }, [size]);

  return (
    <div
      ref={emojiRef}
      className="absolute left-0 top-0"
      style={{
        fontSize: `${size}px`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {emoji}
    </div>
  );
};

export default FloatingEmoji;