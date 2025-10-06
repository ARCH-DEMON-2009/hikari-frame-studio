import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Shipping and Delivery Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Processing Time</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Standard orders are processed within 1-2 business days</li>
          <li>Custom frame orders may take 3-5 business days for processing</li>
          <li>Orders placed during weekends or holidays will be processed on the next business day</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Shipping Methods and Timelines</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Standard Shipping: 3-5 business days</li>
          <li>Express Shipping: 1-2 business days (where available)</li>
          <li>International Shipping: 7-14 business days</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Shipping Charges</h2>
        <p className="mb-4">Shipping charges are calculated based on:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Delivery location</li>
          <li>Package weight and dimensions</li>
          <li>Selected shipping method</li>
        </ul>
        <p>Exact shipping costs will be calculated at checkout.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Tracking Orders</h2>
        <p className="mb-4">Once your order ships, you will receive:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Shipping confirmation email</li>
          <li>Tracking number</li>
          <li>Link to track your package</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Lost or Damaged Shipments</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>We ensure proper packaging to prevent damage during transit</li>
          <li>In case of lost or damaged shipments, please contact us within 48 hours of delivery</li>
          <li>We will work with the shipping carrier to resolve any issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
        <p className="mb-4">For shipping-related queries, please contact us at:</p>
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

export default ShippingPolicy;