
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">
                Commerce<span className="text-primary">Stream</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Your one-stop destination for premium products. Experience seamless shopping with fast delivery and world-class support.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">Daily Deals</Link></li>
              <li><Link href="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Customer Care</h4>
            <ul className="space-y-4">
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">Track Orders</Link></li>
              <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Join Our Stream</h4>
            <p className="text-muted-foreground mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-secondary border-none" />
              <Button>Join</Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 CommerceStream Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
