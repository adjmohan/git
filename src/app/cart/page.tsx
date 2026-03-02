
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 150 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="font-headline font-bold text-3xl">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Look like you haven't added anything to your cart yet. Explore our featured products and start shopping.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 h-12">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline font-bold text-4xl mb-10 flex items-center gap-4">
        Shopping Cart
        <span className="text-lg font-body text-muted-foreground font-normal">({items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="relative w-32 h-32 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-headline font-bold text-xl mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">In Stock • Ships in 2 days</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                  <div className="flex items-center bg-secondary rounded-full p-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xl font-bold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-8 sticky top-24 space-y-6">
            <h2 className="font-headline font-bold text-2xl">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? <span className="text-green-600 font-bold uppercase text-xs">Free</span> : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full rounded-xl h-14 text-lg font-bold shadow-lg shadow-primary/20">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <div className="flex items-center gap-3 justify-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-primary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal icons for this file
function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
