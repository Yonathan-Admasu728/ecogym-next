import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { auth } from '../../../libraries/firebase-admin';
import { getProgram, fetchUserPrograms } from '../../../utils/api';
import { Program } from '../../../types';

// Initialize Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export async function POST(request: NextRequest): Promise<NextResponse<{
  sessionId: string;
  url: string | null;
} | {
  error: string;
}>> {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get request body
    const body = await request.json();
    const { program_id } = body;

    if (!program_id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Get program details
    const program = await getProgram(program_id);
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Handle free programs
    if (program.isFree) {
      return NextResponse.json(
        { error: 'Cannot create checkout session for free program' },
        { status: 400 }
      );
    }

    if (!program.stripe_price_id) {
      return NextResponse.json(
        { error: 'Program is not available for purchase' },
        { status: 400 }
      );
    }

    // Check if already purchased
    const userPrograms = await fetchUserPrograms();
    const isPurchased = userPrograms.purchased_programs.some((p: Program) => p.id === program_id);
    
    if (isPurchased) {
      return NextResponse.json(
        { error: 'Program already purchased' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: decodedToken.email,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: program.stripe_price_id,
          quantity: 1,
        },
      ],
      metadata: {
        program_id: program_id,
        user_id: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/programs/${program_id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/programs/${program_id}`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
