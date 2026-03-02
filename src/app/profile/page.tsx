"use client";

import React from 'react';
import { useUser } from '@/firebase';
import { User, Package, Heart, CreditCard, Power, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading Profile...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const menuItems = [
    { icon: Package, title: "My Orders", subtitle: "Check your order status", href: "/orders" },
    { icon: User, title: "Profile Information", subtitle: "Personal Details, Email", href: "/profile/edit" },
    { icon: MapPin, title: "Manage Addresses", subtitle: "Save addresses for a faster checkout", href: "/profile/addresses" },
    { icon: CreditCard, title: "PAN Card Information", subtitle: "Keep your records updated", href: "/profile/pan" },
    { icon: Heart, title: "Wishlist", subtitle: "All your saved items", href: "/wishlist" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/3 space-y-4">
            {/* User Info Card */}
            <div className="bg-white p-4 flex items-center gap-4 rounded shadow-sm">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="bg-primary text-white font-bold">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-[10px] text-gray-500">Hello,</p>
                <h2 className="font-bold truncate">{user.displayName || user.email}</h2>
              </div>
            </div>

            {/* Account Settings Side Nav */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center gap-3 text-primary font-bold">
                 <User className="w-5 h-5" />
                 Account Settings
              </div>
              <div className="flex flex-col">
                 <button className="p-4 hover:bg-gray-50 text-left text-sm flex items-center justify-between group">
                    Profile Information
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                 </button>
                 <button className="p-4 hover:bg-gray-50 text-left text-sm flex items-center justify-between group">
                    Manage Addresses
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                 </button>
                 <button className="p-4 hover:bg-gray-50 text-left text-sm flex items-center justify-between group">
                    PAN Card Information
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                 </button>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden">
               <button className="w-full p-4 flex items-center gap-3 font-bold text-gray-600 hover:text-primary transition-colors">
                  <Power className="w-5 h-5" />
                  Logout
               </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 bg-white p-6 rounded shadow-sm">
             <h2 className="text-xl font-bold mb-8">Personal Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <p className="text-xs text-gray-500 font-medium">Display Name</p>
                   <p className="font-medium p-2 bg-gray-50 rounded">{user.displayName || 'Not Provided'}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-xs text-gray-500 font-medium">Email Address</p>
                   <p className="font-medium p-2 bg-gray-50 rounded">{user.email}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-xs text-gray-500 font-medium">Account ID</p>
                   <p className="text-[10px] font-mono p-2 bg-gray-50 rounded text-gray-400">{user.uid}</p>
                </div>
             </div>

             <div className="mt-12 border-t pt-8">
                <h3 className="text-lg font-bold mb-6">Frequently Accessed</h3>
                <div className="grid grid-cols-1 gap-4">
                   {menuItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50 cursor-pointer group transition-colors">
                         <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded">
                            <item.icon className="w-5 h-5" />
                         </div>
                         <div className="flex-grow">
                            <h4 className="font-bold text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.subtitle}</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary" />
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