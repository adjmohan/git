
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const paymentMethod = searchParams.get('payment') || 'upi';
  const paymentStatus = searchParams.get('status') || 'paid';

  useEffect(() => {
    const incomingOrderId = searchParams.get('orderId');
    const num = incomingOrderId || ("CS-" + Math.random().toString(36).substr(2, 9).toUpperCase());
    setOrderNumber(num);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h1 className="font-headline font-bold text-5xl mb-4">Success! Order Placed.</h1>
      <p className="text-xl text-muted-foreground max-w-lg mx-auto mb-10">
        {paymentMethod === 'cod'
          ? 'Your order is confirmed. Money is not debited now; pay only on delivery.'
          : "Your order has been confirmed and payment is verified. We'll send you an email notification as soon as it ships."}
      </p>

      <div className="bg-white dark:bg-card border border-border p-8 rounded-[2.5rem] w-full max-w-lg mb-12 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-muted-foreground font-medium">Order Number</span>
            <span className="font-bold text-primary">{orderNumber || 'Generating...'}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-muted-foreground font-medium">Estimated Delivery</span>
            <span className="font-bold">Next 2-3 Business Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">Payment Status</span>
            <span className="text-green-600 font-bold uppercase text-xs px-2 py-1 bg-green-50 rounded">
              {paymentStatus === 'paid' ? 'Verified' : 'Pending (COD)'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-muted-foreground font-medium">Payment Method</span>
            <span className="font-bold uppercase">{paymentMethod}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold border-2">
            <Package className="w-5 h-5 mr-2" />
            Track Order
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button size="lg" className="w-full rounded-2xl h-14 font-bold shadow-lg shadow-primary/20">
            Keep Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <button className="mt-12 text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium">
        <Printer className="w-4 h-4" />
        Print Receipt
      </button>
    </div>
  );
}
