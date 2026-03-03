import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';

const verifySchema = z.object({
  internalOrderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

function isValidSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error('Razorpay key secret is not configured.');
  }

  const body = `${orderId}|${paymentId}`;
  const expected = createHmac('sha256', secret).update(body).digest('hex');

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = verifySchema.parse(body);

    const orderRef = adminDb.collection('orders').doc(payload.internalOrderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderSnap.data();
    if (!orderData) {
      return NextResponse.json({ error: 'Order data unavailable' }, { status: 500 });
    }

    if (orderData.razorpayOrderId !== payload.razorpay_order_id) {
      return NextResponse.json({ error: 'Order mismatch' }, { status: 400 });
    }

    if (!isValidSignature(payload.razorpay_order_id, payload.razorpay_payment_id, payload.razorpay_signature)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const userOrderRef = orderData.userId
      ? adminDb.collection('users').doc(orderData.userId).collection('orders').doc(payload.internalOrderId)
      : null;

    await orderRef.update({
      paymentStatus: 'paid',
      orderStatus: 'placed',
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature,
      paidAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (userOrderRef) {
      await userOrderRef.update({
        paymentStatus: 'paid',
        orderStatus: 'placed',
        razorpayPaymentId: payload.razorpay_payment_id,
        razorpaySignature: payload.razorpay_signature,
        paidAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      orderId: payload.internalOrderId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request payload', details: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Payment verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
