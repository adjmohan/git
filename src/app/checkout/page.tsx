
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, ChevronLeft, ShieldCheck, ShoppingBag, Smartphone, Wallet, CheckCircle } from 'lucide-react';
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
  cardNumber: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  // Owner Merchant Details
  const MERCHANT_UPI = "adjmohan@oksbi";
  const MERCHANT_NAME = "Flipkart Clone Store";

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

  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    if (values.paymentMethod === 'upi') {
      // Construct UPI Deep Link for One-Click Payment
      // pa: payee address, pn: payee name, am: amount, cu: currency, tn: transaction note
      const formattedAmount = total.toFixed(2);
      const upiUrl = `upi://pay?pa=${MERCHANT_UPI}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent('Flipkart Order')}`;
      
      toast({
        title: "Redirecting to UPI",
        description: "Opening GPay/PhonePe/UPI app to complete payment...",
      });

      // Attempt to open the UPI app intent
      // Using window.location.assign for better deep link handling on mobile browsers
      window.location.assign(upiUrl);

      // We wait for the user to return. Since we can't track cross-app success via web,
      // we simulate the order success for this demo/prototype.
      setTimeout(() => {
        clearCart();
        router.push('/order-success');
      }, 5000);
      return;
    }

    // Handle other methods
    toast({
      title: "Processing Payment",
      description: "Verifying transaction with your bank...",
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
            <p className="text-muted-foreground font-medium">Safe & Secure Payments Powered by Flipkart.</p>
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
                                <p className="font-bold text-gray-800">PhonePe / Google Pay / UPI</p>
                                <p className="text-xs text-muted-foreground">One-click instant secure payment</p>
                              </div>
                              <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/upi-4e311a.svg" alt="UPI" className="h-4" />
                            </FormLabel>
                          </div>

                          <div className={cn("flex items-center space-x-3 border p-4 rounded-sm cursor-pointer transition-all", field.value === 'card' ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white')}>
                            <RadioGroupItem value="card" id="card" className="border-primary" />
                            <FormLabel htmlFor="card" className="flex flex-1 items-center gap-3 cursor-pointer">
                              <CreditCard className="w-5 h-5 text-primary" />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">Credit / Debit Card</p>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay, Maestro</p>
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

                <div className="bg-secondary/30 p-6 rounded shadow-inner border border-border">
                  {paymentMethod === 'upi' && (
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 py-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Google_Pay_Logo.svg" alt="GPay" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-6" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Verified Recipient: <span className="font-bold text-gray-800">{MERCHANT_NAME}</span></p>
                      <div className="bg-primary/5 p-4 rounded-sm border border-primary/20 inline-block">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Owner Merchant ID</p>
                        <p className="text-lg font-mono font-bold text-gray-900">{MERCHANT_UPI}</p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">Clicking "Pay" below will automatically launch your GPay/UPI app.</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <Input placeholder="Card Number" className="rounded-sm h-11" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" className="rounded-sm h-11" />
                        <Input placeholder="CVV" className="rounded-sm h-11" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="text-center py-4 space-y-2">
                      <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                      <p className="text-sm font-bold text-gray-700 uppercase">Pay on Delivery Available</p>
                      <p className="text-xs text-muted-foreground">Please keep exact change ready at delivery.</p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-14 rounded-sm text-lg font-bold shadow-lg shadow-primary/20 uppercase tracking-wider">
                Pay ₹{total.toLocaleString()}
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
                    <p className="text-[10px] text-muted-foreground">Seller: SuperComNet • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Price ({items.length} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-bold leading-relaxed">Safe and Secure Payments. 100% Authentic Products Verified to Merchant: <span className="underline">{MERCHANT_UPI}</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
