
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
    console.log('Order placed:', values);
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
                  Payment Options
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className={cn("flex items-center space-x-3 space-y-0 border p-4 rounded-xl cursor-pointer transition-colors", field.value === 'card' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="card" id="card" />
                            <FormLabel htmlFor="card" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <CreditCard className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">Credit / Debit Card</p>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 space-y-0 border p-4 rounded-xl cursor-pointer transition-colors", field.value === 'upi' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="upi" id="upi" />
                            <FormLabel htmlFor="upi" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Smartphone className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">UPI Payments</p>
                                <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                              </div>
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 space-y-0 border p-4 rounded-xl cursor-pointer transition-colors", field.value === 'cod' ? 'bg-primary/5 border-primary' : 'bg-white')}>
                            <RadioGroupItem value="cod" id="cod" />
                            <FormLabel htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <Wallet className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold">Cash on Delivery</p>
                                <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                              </div>
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-secondary/30 p-6 rounded-2xl border border-dashed border-border mt-4">
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0000 0000 0000 0000" {...field} className="rounded-xl h-11" />
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
                              <Input placeholder="MM/YY" {...field} className="rounded-xl h-11" />
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
                              <Input placeholder="123" type="password" {...field} className="rounded-xl h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="flex justify-center gap-6 mb-4">
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border p-1 shadow-sm">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Google_Pay_Logo.svg" alt="GPay" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground">GPay</span>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border p-1 shadow-sm">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground">PhonePe</span>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border p-1 shadow-sm">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground">Paytm</span>
                         </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID (e.g., user@upi)</FormLabel>
                            <FormControl>
                              <Input placeholder="username@bank" {...field} className="rounded-xl h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="text-center py-4">
                      <p className="font-medium">Cash / Card on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay conveniently when your order reaches your doorstep.</p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-16 rounded-[1.5rem] text-xl font-bold shadow-xl shadow-primary/20 uppercase">
                Place Order • ₹{total.toLocaleString()}
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
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-sm">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-primary pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-secondary/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Trusted & Secure</h4>
                  <p className="text-xs text-muted-foreground">Encrypted transactions for your peace of mind.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Quality Guaranteed</h4>
                  <p className="text-xs text-muted-foreground">100% original products with easy returns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
