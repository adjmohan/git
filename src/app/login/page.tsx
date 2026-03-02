
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { toast } from '@/hooks/use-toast';
import { Smartphone, ShieldCheck, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const phoneSchema = z.object({
  phoneNumber: z.string().length(10, 'Enter a valid 10-digit mobile number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [authError, setAuthError] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return (window as any).recaptchaVerifier;
    
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("reCAPTCHA solved");
        },
        'expired-callback': () => {
          toast({ variant: "destructive", title: "reCAPTCHA Expired", description: "Please try again." });
        }
      });
      (window as any).recaptchaVerifier = verifier;
      return verifier;
    } catch (err) {
      console.error("reCAPTCHA Error:", err);
      return null;
    }
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) throw new Error("reCAPTCHA initialization failed.");

      const formatPhone = `+91${values.phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setVerificationId(confirmation);
      setStep('otp');
      toast({ title: "OTP Sent", description: `Verification code sent to ${formatPhone}` });
    } catch (error: any) {
      console.error("Auth Error:", error);
      let errorData = { title: "Error", message: error.message || "Failed to send OTP." };

      if (error.code === 'auth/operation-not-allowed') {
        errorData = {
          title: "Phone Auth Disabled",
          message: "Go to Firebase Console > Authentication > Sign-in method and enable 'Phone'."
        };
      } else if (error.code === 'auth/billing-not-enabled') {
        errorData = {
          title: "Billing Required",
          message: "Real SMS requires the Firebase Blaze plan. For testing, add your number as a 'Test Number' in the Firebase Console."
        };
      } else if (error.code === 'auth/too-many-requests') {
        errorData = {
          title: "Too Many Requests",
          message: "This device is temporarily blocked. Use a Test Number in Firebase Console to continue developing."
        };
      }
      
      setAuthError(errorData);
      toast({ variant: "destructive", title: errorData.title, description: errorData.message });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    if (!verificationId) return;
    setIsLoading(true);
    try {
      const result = await verificationId.confirm(values.otp);
      const firebaseUser = result.user;

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        setDocumentNonBlocking(userRef, {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          phoneNumber: firebaseUser.phoneNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({ title: "Success!", description: "Logged in successfully." });
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Verification Failed", description: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      
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
        <div className="p-10 flex-grow flex flex-col justify-center">
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{authError.title}</AlertTitle>
              <AlertDescription className="text-xs">
                {authError.message}
              </AlertDescription>
            </Alert>
          )}

          {step === 'phone' ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-8">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wide">Enter Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-0 bottom-2 text-base font-medium text-gray-600 border-r pr-2">+91</span>
                          <Input 
                            placeholder="9999999999" 
                            {...field} 
                            className="rounded-none border-t-0 border-x-0 border-b-2 focus-visible:ring-0 focus:border-primary px-0 pl-12 h-10 font-bold text-lg tracking-wider" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                   <p className="text-[10px] text-gray-500 leading-relaxed">
                      By continuing, you agree to Flipkart's <span className="text-primary cursor-pointer hover:underline">Terms of Use</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
                   </p>
                   <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold h-12 rounded-sm shadow-sm uppercase tracking-wide"
                   >
                      {isLoading ? "Requesting OTP..." : "Continue"}
                   </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                    Verify OTP
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Verification code sent to +91 {phoneForm.getValues().phoneNumber}</p>
                </div>
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-500 uppercase">Enter 6-digit OTP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000000" 
                          {...field} 
                          className="rounded-none border-t-0 border-x-0 border-b-2 focus-visible:ring-0 focus:border-primary px-0 h-12 font-bold tracking-[1em] text-center text-2xl text-primary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                   <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold h-12 rounded-sm shadow-sm uppercase tracking-wide"
                   >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                   </Button>
                   <button 
                    type="button" 
                    onClick={() => setStep('phone')} 
                    className="w-full text-center text-primary text-sm font-bold flex items-center justify-center gap-1 hover:underline"
                   >
                     Change Number <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </form>
            </Form>
          )}

          <div className="mt-12 text-center border-t pt-6">
             <Link href="/register" className="text-primary font-bold text-sm hover:underline">
                New to Flipkart? Create an account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
