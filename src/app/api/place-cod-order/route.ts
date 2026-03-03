import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';

const codOrderSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.literal('cod'),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = codOrderSchema.parse(body);

    const orderId = randomUUID();

    await adminDb.collection('orders').doc(orderId).set({
      id: orderId,
      userId: payload.userId,
      amount: payload.amount,
      amountPaise: Math.round(payload.amount * 100),
      currency: 'INR',
      items: payload.items,
      customer: payload.customer,
      paymentMethod: 'cod',
      paymentStatus: 'pending_cod',
      orderStatus: 'placed',
      provider: 'cod',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection('users').doc(payload.userId).collection('orders').doc(orderId).set({
      id: orderId,
      userId: payload.userId,
      amount: payload.amount,
      amountPaise: Math.round(payload.amount * 100),
      currency: 'INR',
      items: payload.items,
      customer: payload.customer,
      paymentMethod: 'cod',
      paymentStatus: 'pending_cod',
      orderStatus: 'placed',
      provider: 'cod',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request payload', details: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Failed to place COD order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
