
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCartStore } from '@/store/useCartStore';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'Valid ZIP code required'),
  cardNumber: z.string().min(16, 'Valid card number required').max(16),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY format'),
  cvv: z.string().min(3, 'Required').max(4),
});

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log('Order placed:', values);
    clearCart();
    router.push('/order-success');
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="font-headline font-bold text-3xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Add items to your cart before proceeding to checkout.</p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 h-12">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/cart" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:translate-x-1 transition-transform">
        <ChevronLeft className="w-5 h-5" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div className="space-y-10">
          <div>
            <h1 className="font-headline font-bold text-4xl mb-2 text-primary">Checkout</h1>
            <p className="text-muted-foreground">Please enter your shipping and payment details below.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                  Shipping Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Shopping St, Apt 4B" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
                  Payment Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/50 p-6 rounded-[2rem] border border-border">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input placeholder="0000 0000 0000 0000" {...field} className="pl-10 rounded-xl h-12" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" type="password" maxLength={4} {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-16 rounded-[1.5rem] text-xl font-bold shadow-xl shadow-primary/20">
                Complete Purchase • ${total.toLocaleString()}
              </Button>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 sticky top-24 space-y-8">
            <h2 className="font-headline font-bold text-2xl">Your Order</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-sm">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-primary pt-2">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-secondary/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Trusted & Secure</h4>
                  <p className="text-xs text-muted-foreground">Every transaction is encrypted and verified for your protection.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Satisfaction Guaranteed</h4>
                  <p className="text-xs text-muted-foreground">30-day money-back guarantee if you're not happy with your purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
