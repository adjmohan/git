import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import * as z from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';

const createOrderSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(['upi', 'card']),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      image: z.string(),
    })
  ).min(1),
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    address: z.string().min(10),
    city: z.string().min(2),
    zip: z.string().min(5),
  }),
});

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay server keys are not configured.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = createOrderSchema.parse(body);

    const razorpay = getRazorpayClient();
    const internalOrderId = randomUUID();
    const amountPaise = Math.round(payload.amount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: internalOrderId.slice(0, 40),
      notes: {
        internalOrderId,
        paymentMethod: payload.paymentMethod,
      },
    });

    await adminDb.collection('orders').doc(internalOrderId).set({
      id: internalOrderId,
      userId: payload.userId,
      amount: payload.amount,
      amountPaise,
      currency: 'INR',
      items: payload.items,
      customer: payload.customer,
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending_payment',
      provider: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection('users').doc(payload.userId).collection('orders').doc(internalOrderId).set({
      id: internalOrderId,
      userId: payload.userId,
      amount: payload.amount,
      amountPaise,
      currency: 'INR',
      items: payload.items,
      customer: payload.customer,
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending_payment',
      provider: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      internalOrderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request payload', details: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
