
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
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
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start leading-none group">
          <span className="font-bold text-2xl italic tracking-tight">Flipkart</span>
          <span className="text-[10px] italic flex items-center gap-0.5 text-accent font-medium">
            Explore <span className="text-white font-bold">Plus</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Input 
            placeholder="Search for products, brands and more" 
            className="w-full bg-white text-black border-none focus-visible:ring-0 rounded-sm shadow-sm h-9"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 cursor-pointer" />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-8">
          {isUserLoading ? (
            <div className="w-20 h-4 bg-white/20 animate-pulse rounded"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white font-bold hover:bg-white/10 gap-1">
                  {user.displayName || 'My Account'}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Badge className="w-4 h-4 rounded-full p-0" /> Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-primary font-bold hover:bg-gray-100 rounded-sm px-10 h-8">
                Login
              </Button>
            </Link>
          )}

          <Link href="/cart" className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity relative">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] border-2 border-primary">
                  {itemCount}
                </Badge>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-black py-4 px-4 space-y-4 border-b">
          <div className="relative">
            <Input 
              placeholder="Search products..." 
              className="w-full bg-secondary border-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {!user && (
              <Link href="/login" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">Login / Register</span>
              </Link>
            )}
            {user && (
              <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">My Profile</span>
              </Link>
            )}
            <Link href="/cart" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="font-medium">Cart {mounted && itemCount > 0 ? `(${itemCount})` : ''}</span>
            </Link>
            {user && (
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-destructive w-full text-left">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
