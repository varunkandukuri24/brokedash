'use client'

import React from 'react';
import Navbar from '@/components/Navbar';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightAccent">
      <Navbar />
      <div className="container mx-auto mb-4 pt-20 px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-black">
        <h1 className="text-4xl font-bold mb-8 text-black text-center">Privacy Policy for brokedash</h1>
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">Welcome to brokedash. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our application.</p>

          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">We collect the following information:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Email address</li>
            <li>Monthly spending amount on food</li>
            <li>Income level</li>
            <li>Country of residence (IP address). We do not store this, but it is used to determine your country for ranking purposes.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Provide and improve the web app</li>
            <li>Calculate your spending rank and category</li>
            <li>Generate anonymous statistics for the leaderboard</li>
            <li>Ensure the security and functionality of the app</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Data Protection and Non-Commercial Use</h2>
          <p className="mb-4">We want to emphasize that:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Your personal data will never be sold to third parties</li>
            <li>We do not use your data for any commercial purposes</li>
            <li>Your information is used solely for the functionality of the app</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">5. Data Storage and Security</h2>
          <p className="mb-4">We use Supabase to store your data securely. Our data storage practices are designed to protect your information from unauthorized access or disclosure.</p>

          <h2 className="text-2xl font-semibold mb-4">6. User Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Access your personal data</li>
            <li>Request correction of your data</li>
            <li>Delete your account and associated data</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p className="mb-4">We use cookies to store your country information for app functionality.</p>

          <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
          <p className="mb-4">We use Vercel for hosting and deployment. Please refer to Vercel's privacy policy for information on how they handle hosting data.</p>

          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="mb-4">We may update this policy from time to time. We will notify you of any significant changes by posting the new policy on this page.</p>

          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
