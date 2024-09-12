'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  return (
    <footer className="bg-black text-white py-4 px-6">
      {isHomePage ? (
        <div className="flex justify-between items-center">
          <div>© 2024 brokedash</div>
          <div className="space-x-4">
            <Link href="/contact" className="hover:underline">Contact</Link>
            <a href="https://twitter.com/brokedash" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;