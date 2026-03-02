"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

declare global {
  interface Window {
    phoneEmailVerify: (clientId: string) => void;
    phoneEmailListener: (userObj: { phoneNumber: string; user_json_url: string }) => void;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // User's Client ID
  const CLIENT_ID = "15019613120387252998";

  useEffect(() => {
    setMounted(true);
    if (user && !user.isAnonymous) {
      router.push('/');
    }

    // Phone.Email Listener
    window.phoneEmailListener = async (userObj) => {
      setIsLoading(true);
      try {
        // Since we are using client-side only, we sign in anonymously 
        // and link the phone number in Firestore for the profile.
        const userCredential = await signInAnonymously(auth);
        const firebaseUser = userCredential.user;

        if (db) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          setDocumentNonBlocking(userRef, {
            id: firebaseUser.uid,
            phone: userObj.phoneNumber,
            isVerified: true,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }

        toast({ 
          title: "Verification Successful", 
          description: `Logged in with ${userObj.phoneNumber}` 
        });
        
        router.push('/profile');
      } catch (error: any) {
        console.error("Verification Error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not sync your verified number.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    return () => {
      delete (window as any).phoneEmailListener;
    };
  }, [user, router, auth, db]);

  const handleVerifyClick = () => {
    if (typeof window.phoneEmailVerify === 'function') {
      window.phoneEmailVerify(CLIENT_ID);
    } else {
      toast({
        variant: "destructive",
        title: "Script Error",
        description: "Verification script not ready. Please refresh.",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-sm shadow-md overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Left Side Branding */}
        <div className="bg-primary p-10 text-white flex flex-col justify-between md:w-2/5">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-white uppercase italic tracking-tighter">Login</h1>
            <p className="text-lg opacity-80 text-white font-medium">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="hidden md:block">
             <img 
               src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/login_img_c4a81e.png" 
               alt="Flipkart Login" 
               className="w-full h-auto object-contain opacity-60" 
             />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-10 flex-grow flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Mobile Verification
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Flipkart uses real-time OTP to keep your account secure.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                <Phone className="w-10 h-10 text-primary" />
              </div>
              <Button 
                onClick={handleVerifyClick}
                disabled={isLoading}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 rounded-sm uppercase tracking-wider shadow-lg"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify with OTP'}
              </Button>
            </div>
            
            <div className="space-y-4 pt-4">
              <p className="text-[10px] text-gray-400 font-medium text-center md:text-left">
                By continuing, you agree to Flipkart's <span className="text-primary font-bold cursor-pointer">Terms of Use</span> and <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>

          <div className="mt-8">
             <Alert className="bg-blue-50 border-blue-100">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="text-xs font-bold text-primary uppercase tracking-tight">Real-Time OTP</AlertTitle>
                <AlertDescription className="text-[10px] text-primary/80 font-medium">
                  Verify your phone number instantly via the secure popup. No manual code entry required.
                </AlertDescription>
             </Alert>
          </div>

          <div className="mt-10 text-center border-t pt-6 w-full">
             <Link href="/register" className="text-primary font-bold text-sm hover:underline">
                New to Flipkart? Create an account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
