'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer className="bg-black text-white py-4 px-6">
      <div className={`flex justify-center items-center`}>
        <div className="space-x-2 sm:space-x-4 text-xs sm:text-sm md:text-base">
          <a href="mailto:vkandukuri24@gmail.com" className="hover:underline">Contact</a>
          {isHomePage && (
            <>
              <a href="https://twitter.com/varunkandu" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
              <Link href="/privacypolicy" className="hover:underline">Privacy Policy</Link>
              <Link href="/tos" className="hover:underline">Terms of Service</Link>
            </>
          )}
          {!isHomePage && (
            <Link href="/privacypolicy" className="hover:underline">Privacy Policy</Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;