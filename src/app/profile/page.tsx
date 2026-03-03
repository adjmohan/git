"use client";

import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { User, Package, Heart, Power, ChevronRight, MapPin, Loader2, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-bold">Loading Flipkart Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out", description: "You have been successfully logged out." });
      router.push('/');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const menuItems = [
    { icon: Package, title: "My Orders", subtitle: "Check your order status", href: "/orders" },
    { icon: User, title: "Profile Information", subtitle: "Personal Details, Email", href: "/profile/edit" },
    { icon: MapPin, title: "Manage Addresses", subtitle: "Save addresses for a faster checkout", href: "/profile/addresses" },
    { icon: Heart, title: "Wishlist", subtitle: "All your saved items", href: "/wishlist" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/3 space-y-4">
            {/* User Info Card */}
            <div className="bg-white p-4 flex items-center gap-4 rounded shadow-sm border border-gray-100">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="bg-primary text-white font-bold text-lg">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Hello,</p>
                <h2 className="font-bold truncate text-lg">{user.displayName || 'Flipkart User'}</h2>
              </div>
            </div>

            {/* Account Settings Side Nav */}
            <div className="bg-white rounded shadow-sm overflow-hidden hidden md:block border border-gray-100">
              <div className="p-4 border-b flex items-center gap-3 text-primary font-bold bg-primary/5">
                 <User className="w-5 h-5" />
                 Account Settings
              </div>
              <div className="flex flex-col">
                 <button className="p-4 hover:bg-gray-50 text-left text-sm flex items-center justify-between group border-b">
                    Profile Information
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                 </button>
                 <button className="p-4 hover:bg-gray-50 text-left text-sm flex items-center justify-between group">
                    Manage Addresses
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                 </button>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
               <button 
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-3 font-bold text-gray-600 hover:text-destructive transition-colors text-sm"
               >
                  <Power className="w-5 h-5" />
                  Logout
               </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 bg-white p-8 rounded shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                <Badge variant="secondary" className="bg-blue-50 text-primary hover:bg-blue-50 border-none px-3 py-1 flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3" />
                   Standard Account
                </Badge>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Email Address</p>
                   <p className="font-bold p-4 bg-gray-50 rounded border border-gray-100 text-gray-700 truncate">{user.email}</p>
                </div>
                <div className="space-y-3">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Display Name</p>
                   <p className="font-bold p-4 bg-gray-50 rounded border border-gray-100 text-gray-700">{user.displayName || 'Not Set'}</p>
                </div>
                <div className="space-y-3">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">User ID</p>
                   <p className="text-xs font-mono p-4 bg-gray-50 rounded text-gray-400 truncate border border-gray-100">{user.uid}</p>
                </div>
                <div className="space-y-3">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Account Type</p>
                   <p className="font-bold p-4 bg-gray-50 rounded border border-gray-100 text-gray-700">Email Verified</p>
                </div>
             </div>

             <div className="mt-16 border-t pt-10">
                <h3 className="text-xl font-bold mb-8 text-gray-800">Frequently Accessed</h3>
                <div className="grid grid-cols-1 gap-4">
                   {menuItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 border rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer group transition-all">
                         <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            <item.icon className="w-6 h-6" />
                         </div>
                         <div className="flex-grow">
                            <h4 className="font-bold text-base text-gray-800">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.subtitle}</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
