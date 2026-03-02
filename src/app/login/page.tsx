
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { ShieldCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-sm shadow-md overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Left Side Branding */}
        <div className="bg-primary p-10 text-white flex flex-col justify-between md:w-2/5">
          <div>
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <p className="text-lg opacity-80">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="hidden md:block">
             <img 
               src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/login_img_c4a81e.png" 
               alt="Login Banner" 
               className="w-full h-auto object-contain opacity-60" 
             />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-10 flex-grow flex flex-col justify-center items-center text-center">
          <div className="mb-8 max-w-sm">
            <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Mobile Login</h2>
            <p className="text-sm text-gray-500">Log in securely using your phone number via Phone.Email verified OTP.</p>
          </div>

          <div className="w-full max-w-[300px] mb-8">
            {/* Phone.Email Sign-in Button */}
            <div 
              className="pe_signin_button" 
              data-client-id="15019613120387252998"
              data-redirect-uri={typeof window !== 'undefined' ? `${window.location.origin}/callback` : ''}
            ></div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 text-blue-800 text-left max-w-sm">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-xs font-bold">Safe & Verified</AlertTitle>
            <AlertDescription className="text-[10px] leading-relaxed">
              We use encrypted verification. Your number is never shared with third parties without your consent.
            </AlertDescription>
          </Alert>

          <div className="mt-12 text-center border-t pt-6 w-full">
             <Link href="/register" className="text-primary font-bold text-sm hover:underline">
                New to Flipkart? Create an account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
