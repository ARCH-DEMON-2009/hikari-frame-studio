import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">At Hikari, we collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Personal information (name, email, phone number)</li>
          <li>Shipping address for product delivery</li>
          <li>Payment information through our payment processor</li>
          <li>Device information and browsing data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your orders</li>
          <li>Send important updates about our services</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Third-Party Services</h2>
        <p className="mb-4">We use the following third-party services:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Razorpay for payment processing</li>
          <li>Supabase for data storage</li>
        </ul>
        <p>These services have their own privacy policies that govern how they handle your data.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
        <p className="mb-4">If you have any questions about our Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;