import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const CheckoutPage = () => {
	// ...existing hooks and variables...

	// Razorpay test key (for demo only, do not use in production)
	const RAZORPAY_KEY_ID = 'rzp_test_RCyW1Kc2NJj22T';

	const handlePlaceOrder = async () => {
		if (!user) {
			toast({
				title: "Login Required",
				description: "Please login to place an order",
				variant: "destructive",
			});
			navigate('/auth');
			return;
		}

		if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
			toast({
				title: "Missing Information",
				description: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}

		setIsProcessing(true);
		try {
			const orderData = {
				customer: customerInfo,
				items: items,
				paymentMethod: paymentMethod,
				total: total
			};

			const authHeaders = user ? {
				'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
			} : {};

			const { data, error } = await supabase.functions.invoke('create-order', {
				body: orderData,
				headers: authHeaders
			});

			if (error) throw error;
			if (!data.success) {
				throw new Error(data.error || 'Failed to create order');
			}

			if (paymentMethod === 'RAZORPAY' && data.razorpayOrder) {
				if (!(window as any).Razorpay) {
					throw new Error('Razorpay SDK failed to load');
				}
				const options = {
					key: RAZORPAY_KEY_ID,
					amount: data.razorpayOrder.amount,
					currency: data.razorpayOrder.currency,
					name: 'Hikari Frame Studio',
					description: `Order #${data.orderId}`,
					order_id: data.razorpayOrder.id,
					handler: async function (response: any) {
						try {
							const verifyData = {
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature
							};
							const { error: verifyError, data: verifyResponse } = await supabase.functions.invoke('verify-payment', {
								body: verifyData
							});
							if (verifyError || !verifyResponse?.success) {
								throw new Error(verifyError?.message || 'Payment verification failed');
							}
							clearCart();
							toast({
								title: "Order Placed Successfully!",
								description: "You will receive a confirmation email shortly",
							});
							navigate('/orders');
						} catch (error) {
							console.error('Payment verification failed:', error);
							toast({
								title: "Payment Verification Failed",
								description: "Please try again or contact support",
								variant: "destructive",
							});
						}
					},
					modal: {
						ondismiss: function() {
							setIsProcessing(false);
							toast({
								title: "Payment Cancelled",
								description: "You can try again or choose a different payment method",
								variant: "default",
							});
						}
					},
					prefill: {
						name: customerInfo.name,
						email: customerInfo.email,
						contact: customerInfo.phone
					},
					theme: {
						color: '#4F46E5'
					}
				};
				const rzp = new (window as any).Razorpay(options);
				rzp.on('payment.failed', function (response: any) {
					console.error('Payment failed:', response.error);
					toast({
						title: "Payment Failed",
						description: response.error.description || "Please try again or choose a different payment method",
						variant: "destructive",
					});
					setIsProcessing(false);
				});
				rzp.open();
			} else {
				clearCart();
				toast({
					title: "Order Placed Successfully!",
					description: "Your order will be delivered in 3-5 business days",
				});
				navigate('/orders');
			}
		} catch (error) {
			console.error('Error placing order:', error);
			toast({
				title: "Order Failed",
				description: error?.message || "Please try again or contact support",
				variant: "destructive",
			});
		} finally {
			setIsProcessing(false);
		}
	};
