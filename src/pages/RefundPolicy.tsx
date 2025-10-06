import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Refund and Cancellation Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
        <p className="mb-4">We accept refund requests under the following conditions:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Product received is damaged or defective</li>
          <li>Product received is significantly different from what was ordered</li>
          <li>Order was not delivered within the specified timeline</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Refund Timeline</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Refund requests must be submitted within 7 days of receiving the product</li>
          <li>Once approved, refunds will be processed within 5-7 working days</li>
          <li>The refund will be credited to the original payment method used for the purchase</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Items</h2>
        <p className="mb-4">The following items are not eligible for refund:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Customized or personalized products</li>
          <li>Products that have been used or damaged after delivery</li>
          <li>Digital products or services that have been accessed or downloaded</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Cancellation Policy</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Orders can be cancelled before they are shipped</li>
          <li>Cancellation requests for shipped orders will be treated as returns</li>
          <li>For customized orders, cancellation is only possible before production begins</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
        <p className="mb-4">To request a refund, please contact our customer service:</p>
        <ul className="list-none mb-4">
          <li>Email: Hikari21082025@gmail.com</li>
          <li>Phone: 7037917438</li>
        </ul>
        <p>Please include your order number and reason for the refund in your request.</p>
      </section>

      <footer className="text-sm text-gray-600">
        <p>Last updated: October 6, 2025</p>
      </footer>
    </div>
  );
};

export default RefundPolicy;