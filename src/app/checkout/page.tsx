"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, ChevronLeft, ShieldCheck, ShoppingBag, Smartphone, Wallet } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'Valid ZIP code required'),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
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
      paymentMethod: 'upi',
    },
  });

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    toast({
      title: "Processing Payment",
      description: "Redirecting to payment gateway...",
    });

    setTimeout(() => {
      clearCart();
      router.push('/order-success');
    }, 2000);
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
            <h1 className="font-headline font-bold text-4xl mb-2 text-primary uppercase tracking-tight italic">Checkout</h1>
            <p className="text-muted-foreground font-medium">Safe & Secure Payments.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                  Delivery Address
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs font-bold uppercase text-gray-400">Full Name</FormLabel>
                        <FormControl><Input placeholder="Name" {...field} className="rounded-sm h-12 border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-xs font-bold uppercase text-gray-400">Street Address</FormLabel>
                        <FormControl><Input placeholder="Address" {...field} className="rounded-sm h-12 border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase text-gray-400">City</FormLabel>
                        <FormControl><Input placeholder="City" {...field} className="rounded-sm h-12 border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase text-gray-400">Pincode</FormLabel>
                        <FormControl><Input placeholder="6-digit PIN" {...field} className="rounded-sm h-12 border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-xl font-headline font-bold">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
                  Select Payment Method
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-3">
                          <div className={cn("flex items-center space-x-3 border p-4 rounded-sm cursor-pointer transition-all", field.value === 'upi' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white')}>
                            <RadioGroupItem value="upi" id="upi" className="border-primary" />
                            <FormLabel htmlFor="upi" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Smartphone className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">Instant UPI (GPay / PhonePe)</p>
                                <p className="text-xs text-muted-foreground">Safe and secure digital payment</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 border p-4 rounded-sm cursor-pointer transition-all", field.value === 'card' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white')}>
                            <RadioGroupItem value="card" id="card" className="border-primary" />
                            <FormLabel htmlFor="card" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <CreditCard className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">Credit / Debit Card</p>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 border p-4 rounded-sm cursor-pointer transition-all", field.value === 'cod' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white')}>
                            <RadioGroupItem value="cod" id="cod" className="border-primary" />
                            <FormLabel htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Wallet className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">Cash on Delivery</p>
                                <p className="text-xs text-muted-foreground">Pay when you receive the order</p>
                              </div>
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full h-14 rounded-sm text-lg font-bold shadow-lg shadow-primary/20 uppercase tracking-wider">
                Proceed to Pay
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:pl-8">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-6 sticky top-24 space-y-6">
            <h2 className="font-headline font-bold text-xl uppercase tracking-tighter italic border-b pb-3 text-primary">Price Details</h2>
            <div className="space-y-4 max-h-[300px] overflow-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-12 h-12 bg-secondary rounded-sm overflow-hidden flex-shrink-0 p-1">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-bold line-clamp-1 text-gray-800">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Total Amount</span>
                <span className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-bold leading-relaxed">Secure payment verification active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
