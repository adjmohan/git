"use client";

import React from 'react';
import Link from 'next/link';
import { collection, orderBy, query } from 'firebase/firestore';
import { ChevronLeft, Package, Loader2 } from 'lucide-react';
import { useFirestore, useMemoFirebase, useUser, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserOrder {
  id: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'pending_cod';
  orderStatus: 'pending_payment' | 'placed';
  createdAt?: { toDate?: () => Date };
}

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, `users/${user.uid}/orders`), orderBy('createdAt', 'desc'))
        : null,
    [firestore, user]
  );

  const { data: orders, isLoading } = useCollection<UserOrder>(ordersQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="font-bold text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Please login to view your orders</h1>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/profile" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:translate-x-1 transition-transform">
        <ChevronLeft className="w-5 h-5" />
        Back to Profile
      </Link>

      <div className="bg-white border rounded shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-headline font-bold text-primary">My Orders</h1>
        <Separator />

        {!orders || orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="font-bold text-lg">No orders yet</p>
            <p className="text-muted-foreground text-sm">Place your first order from checkout.</p>
            <Link href="/products">
              <Button className="mt-2">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : null;

              return (
                <div key={order.id} className="border rounded p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="font-bold">Order ID: {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {createdAt ? createdAt.toLocaleString() : 'Just now'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                    <p>
                      Amount: <span className="font-bold">₹{Number(order.amount || 0).toLocaleString()}</span>
                    </p>
                    <p>
                      Payment: <span className="font-bold uppercase">{order.paymentMethod}</span>
                    </p>
                    <p>
                      Status:{' '}
                      <span className="font-bold uppercase text-green-600">
                        {order.paymentStatus === 'paid' ? 'Verified' : order.paymentStatus === 'pending_cod' ? 'Not Debited (COD)' : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
