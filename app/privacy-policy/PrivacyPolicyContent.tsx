// app/privacy-policy/PrivacyPolicyContent.tsx
'use client';

import React from 'react';

const PrivacyPolicyContent = (): JSX.Element => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">1. Introduction</h2>
          <p className="mb-4">
            At Ecogym, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">2. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, such as:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information (e.g., name, email address, date of birth)</li>
            <li>Account information (e.g., username, password)</li>
            <li>Profile information (e.g., fitness goals, preferences)</li>
            <li>Usage data (e.g., workout history, meditation sessions completed)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">3. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your experience on our platform</li>
            <li>Communicate with you about our services</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">4. Information Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell or rent your personal information to third parties. We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a merger, sale, or acquisition of all or a portion of our company</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">5. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">6. Your Rights and Choices</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal information</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Request portability of your personal information</li>
            <li>Opt-out of certain communications from us</li>
          </ul>
        </section>

        <section className="mb-12">
  <h2 className="text-2xl font-semibold mb-4 text-teal-400">7. Changes to This Privacy Policy</h2>
  <p className="mb-4">
    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
  </p>
</section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-teal-400">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@ecogym.space" className="text-teal-400 hover:underline">privacy@ecogym.space</a>.
          </p>
        </section>

        <p className="mt-12 text-sm text-gray-400 text-center">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
