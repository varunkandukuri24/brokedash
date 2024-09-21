'use client'

import React from 'react';
import Navbar from '@/components/Navbar';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightAccent">
      <Navbar />
      <div className="container mx-auto pt-20 px-4 md:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-black">
        <h1 className="text-4xl font-bold mb-8 text-black text-center">Terms of Service for brokedash</h1>
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using brokedash, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">brokedash is a web application that allows users to compare their food delivery spending habits anonymously with others in the same country, based on their IP address.</p>

          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">3.1. To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</p>
          <p className="mb-4">3.2. While we do not disclose your email in anonymous rankings, you are responsible for maintaining the confidentiality of your account.</p>
          <p className="mb-4">3.3. You agree to accept responsibility for all activities that occur under your account.</p>

          <h2 className="text-2xl font-semibold mb-4">4. User Data</h2>
          <p className="mb-4">4.1. We collect and use your data as described in our Privacy Policy.</p>
          <p className="mb-4">4.2. You retain all rights to your data. By using the Service, you grant us permission to use, process, and analyze your data to provide and improve the service.</p>
          <p className="mb-4">4.3. We do not sell your personal data or use it for commercial purposes beyond providing the service.</p>

          <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
          <p className="mb-4">You agree not to:</p>
          <p className="mb-4">5.1. Use the Service for any unlawful purpose or in violation of these Terms.</p>
          <p className="mb-4">5.2. Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service.</p>
          <p className="mb-4">5.3. Interfere with or disrupt the Service or servers or networks connected to the Service.</p>

          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">The Service and its original content, features, and functionality are owned by brokedash.</p>

          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p className="mb-4">We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">In no event shall brokedash, nor its affiliated creators, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="mb-4">We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>

          <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
          <p className="mb-4">These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>

          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us at support@brokedash.com.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
