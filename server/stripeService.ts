import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not provided - payment features will be disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null;

// Product and price IDs (will be created in Stripe dashboard)
export const STRIPE_CONFIG = {
  products: {
    premium: process.env.STRIPE_PREMIUM_PRODUCT_ID || 'prod_premium', // Will be set after product creation
  },
  prices: {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1Ruj63BKLw8db4kQBkH30CSj', // $4.99 CAD monthly
    yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_1Ruj7KBKLw8db4kQUCiQ1yEw',   // $49.99 CAD yearly
  }
};

export interface CreateCheckoutSessionOptions {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(options: CreateCheckoutSessionOptions) {
  if (!stripe) {
    throw new Error('Stripe not configured - please provide STRIPE_SECRET_KEY');
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: options.userEmail,
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: {
        userId: options.userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe not configured - please provide STRIPE_SECRET_KEY');
  }
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string, prorated = true) {
  if (!stripe) {
    throw new Error('Stripe not configured - please provide STRIPE_SECRET_KEY');
  }
  
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId, {
      prorate: prorated,
      invoice_now: prorated,
    });

    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured - please provide STRIPE_SECRET_KEY');
  }
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

export async function handleWebhook(payload: Buffer, signature: string) {
  if (!stripe) {
    throw new Error('Stripe not configured - please provide STRIPE_SECRET_KEY');
  }
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}