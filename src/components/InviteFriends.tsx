'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const InviteFriends: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shareOptions = [
    { name: 'Twitter', icon: 'twitter' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'WhatsApp', icon: 'whatsapp' },
    { name: 'Email', icon: 'mail' },
  ];

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://yourdomain.com/invite');
    alert('Invite link copied to clipboard!');
  };

  return (
    <div className="bg-orange-200 border-black border-4 rounded-lg shadow-2xl p-4 relative">
      <h2 className="text-lg font-bold text-center text-white bg-black p-2 mb-4">
        Wanna compare anonymously with your friends?
      </h2>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
      >
        Invite Now
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-orange-200 border-black border-4 rounded-lg shadow-2xl p-4 max-w-md w-full">
            <h3 className="text-lg font-bold text-center text-white bg-black p-2 mb-4">
              Invite Your Friends
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  className="bg-white hover:bg-orange-300 text-black font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
                >
                  {option.name}
                </Button>
              ))}
            </div>
            <Button
              onClick={copyInviteLink}
              className="w-full bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
            >
              Copy Invite Link
            </Button>
            <p className="text-sm text-center mt-4 text-black">
              We will send you your brokestats at the end of every month
            </p>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-white hover:bg-orange-300 text-black font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] border-2 border-black"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriends;