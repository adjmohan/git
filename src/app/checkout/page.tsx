
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, ShoppingBag, Smartphone, Wallet } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from '@/store/useCartStore';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'Valid ZIP code required'),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
  upiId: z.string().optional(),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
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
      paymentMethod: 'card',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log('Order submitted:', values);
    clearCart();
    router.push('/order-success');
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="font-headline font-bold text-3xl">Your cart is empty</h1>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 h-12">Continue Shopping</Button>
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
        <div className="space-y-10">
          <div>
            <h1 className="font-headline font-bold text-4xl mb-2 text-primary">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase by providing shipping and payment info.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                  Shipping Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} className="rounded-xl h-12" /></FormControl>
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
                        <FormControl><Input placeholder="123 Shopping Lane" {...field} className="rounded-xl h-12" /></FormControl>
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
                        <FormControl><Input placeholder="Mumbai" {...field} className="rounded-xl h-12" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl><Input placeholder="400001" {...field} className="rounded-xl h-12" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
                  Payment Method
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-3">
                          <div className={cn("flex items-center space-x-3 border p-4 rounded-xl cursor-pointer", field.value === 'card' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="card" id="card" />
                            <FormLabel htmlFor="card" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <CreditCard className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">Credit / Debit Card</p>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 border p-4 rounded-xl cursor-pointer", field.value === 'upi' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="upi" id="upi" />
                            <FormLabel htmlFor="upi" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Smartphone className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">UPI Payments</p>
                                <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 border p-4 rounded-xl cursor-pointer", field.value === 'cod' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="cod" id="cod" />
                            <FormLabel htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Wallet className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">Cash on Delivery</p>
                                <p className="text-xs text-muted-foreground">Pay when you receive the items</p>
                              </div>
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="bg-secondary/30 p-6 rounded-2xl border border-dashed border-border">
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Card Number</FormLabel>
                            <FormControl><Input placeholder="0000 0000 0000 0000" {...field} className="rounded-xl h-11" /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="flex justify-around mb-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Google_Pay_Logo.svg" alt="GPay" className="h-6 opacity-60" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-6 opacity-60" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-4 opacity-60" />
                      </div>
                      <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID (e.g., username@bank)</FormLabel>
                            <FormControl><Input placeholder="Enter UPI ID" {...field} className="rounded-xl h-11" /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <p className="text-center text-sm font-medium text-muted-foreground py-4">Safe and secure delivery. Pay on arrival.</p>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 uppercase">
                Pay ₹{total.toLocaleString()}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:pl-8">
          <div className="bg-white border border-border rounded-[2rem] p-8 sticky top-24 space-y-6">
            <h2 className="font-headline font-bold text-2xl">Order Summary</h2>
            <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-14 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0 p-1">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-xs">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-primary pt-2">
                <span>Grand Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Your data is secured using end-to-end encryption. Shop with confidence on Flipkart.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
