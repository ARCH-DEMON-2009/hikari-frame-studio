import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing and using Hikari's website and services, you accept and agree to be bound by these Terms and Conditions.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>You must be at least 18 years old to use our services</li>
          <li>You agree to provide accurate and complete information</li>
          <li>You are responsible for maintaining the confidentiality of your account</li>
          <li>You agree not to use our service for any unlawful purpose</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="mb-4">All content on this website, including images, text, and designs, is the property of Hikari and is protected by copyright laws.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Product Information</h2>
        <p className="mb-4">We strive to display accurate product information, but we do not warrant that product descriptions or prices are accurate, complete, or current.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">Hikari shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
        <p className="mb-4">We use Razorpay for payment processing. By making a purchase, you agree to their terms of service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
        <p className="mb-4">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
        <p className="mb-4">For questions about these Terms and Conditions, please contact us:</p>
        <ul className="list-none mb-4">
          <li>Email: Hikari21082025@gmail.com</li>
          <li>Phone: 7037917438</li>
        </ul>
      </section>

      <footer className="text-sm text-gray-600">
        <p>Last updated: October 6, 2025</p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;