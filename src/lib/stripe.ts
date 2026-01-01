import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2025-12-15.clover',
})

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  mode: 'subscription' = 'subscription'
) {
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    client_reference_id: userId,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session
}

export async function handleSubscriptionChange(
  subscriptionId: string,
  status: string,
  userId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
  
  const subscriptionStatus = 
    status === 'active' ? 'premium' :
    status === 'trialing' ? 'trial' : 'free'

  // Update user in database
  // This will be called from webhook handler
  return {
    subscriptionStatus,
    subscriptionEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
  }
}
