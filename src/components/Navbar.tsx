import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-black text-white py-4 px-6 flex justify-center mb-16">
      <Link href="/" className="text-2xl font-bold mx-auto">brokedash</Link>
    </nav>
  );
};

export default Navbar;