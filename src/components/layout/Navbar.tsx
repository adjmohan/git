
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-headline font-bold text-xl tracking-tight hidden sm:block">
            Commerce<span className="text-primary">Stream</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search for products, brands and more" 
            className="pl-10 w-full bg-secondary border-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="w-5 h-5" />
                <span>Account</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/orders">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="default" className="gap-2 rounded-full px-5 shadow-primary/20 shadow-lg">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart</span>
              {itemCount > 0 && (
                <Badge variant="secondary" className="bg-white text-primary rounded-full px-1.5 h-5 min-w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top duration-300 bg-white dark:bg-card border-b border-border py-4 px-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 w-full bg-secondary border-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">Account</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="font-medium">Cart ({itemCount})</span>
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-lg bg-secondary col-span-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-medium">Wishlist</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
