// app/terms-of-service/TermsOfServiceContent.tsx
'use client';

import React from 'react';

const TermsOfServiceContent = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Ecogym platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">2. Description of Service</h2>
          <p className="mb-4">
            Ecogym provides a platform for fitness and meditation content. We offer workout programs, guided meditations, and related wellness resources.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old to use this service.</li>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You agree to use the service for lawful purposes only.</li>
            <li>You should consult with a physician before starting any exercise program.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">4. Intellectual Property</h2>
          <p className="mb-4">
            The content on Ecogym, including text, graphics, logos, and video content, is the property of Ecogym and protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">5. Limitation of Liability</h2>
          <p className="mb-4">
            Ecogym shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">6. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@ecogym.space" className="text-teal-400 hover:underline">legal@ecogym.space</a>.
          </p>
        </section>

        <p className="mt-12 text-sm text-gray-400 text-center">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default TermsOfServiceContent;