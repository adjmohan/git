
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Smartphone, CheckCircle2 } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const phoneSchema = z.object({
  phoneNumber: z.string().length(10, 'Enter a valid 10-digit mobile number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
});

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const setupRecaptcha = () => {
    if (!auth) return;
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log("reCAPTCHA solved");
          }
        });
      }
    } catch (error) {
      console.error("reCAPTCHA error:", error);
    }
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formatPhone = `+91${values.phoneNumber}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setVerificationId(confirmation);
      setStep('otp');
      toast({ title: "OTP Sent", description: `Verification code sent to +91 ${values.phoneNumber}` });
    } catch (error: any) {
      console.error("Phone login error:", error);
      let message = "Failed to send OTP. Please check your connection.";
      
      if (error.code === 'auth/operation-not-allowed') {
        message = "Phone auth is not enabled in Firebase Console.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many attempts. Please try again later.";
      } else if (error.message?.includes('billing')) {
        message = "Blaze plan required for real SMS. Use a Test Number for development.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });

      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
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

      if (db) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        setDocumentNonBlocking(userRef, {
          id: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({ title: "Login Successful", description: "Welcome back to Flipkart!" });
      router.push('/profile');
    } catch (error: any) {
      console.error("OTP Error:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      <div className="max-w-4xl w-full bg-white rounded-sm shadow-md overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Left Side Branding */}
        <div className="bg-primary p-10 text-white flex flex-col justify-between md:w-2/5">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
            <p className="text-lg opacity-80 text-white">Get access to your Orders, Wishlist and Recommendations</p>
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
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {step === 'phone' ? 'Mobile Login' : 'Verify OTP'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 'phone' 
                ? 'Enter your mobile number to get started.' 
                : `We've sent a 6-digit code to +91 ${phoneForm.getValues('phoneNumber')}`}
            </p>
          </div>

          {step === 'phone' ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-8">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-500">Mobile Number</FormLabel>
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary transition-all">
                        <span className="text-gray-500 font-bold px-3">+91</span>
                        <FormControl>
                          <Input 
                            placeholder="Enter 10-digit number" 
                            {...field} 
                            className="border-none focus-visible:ring-0 rounded-none h-12 text-lg font-medium p-0" 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4 pt-4">
                  <p className="text-[10px] text-gray-400">
                    By continuing, you agree to Flipkart's <span className="text-primary font-bold cursor-pointer">Terms of Use</span> and <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>.
                  </p>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-sm uppercase text-sm shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request OTP'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-6">
                      <FormLabel className="text-xs font-bold text-gray-500 self-start">Enter 6-digit OTP</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          className="gap-2"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-sm uppercase text-sm shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => {
                        setStep('phone');
                        otpForm.reset();
                    }}
                    className="w-full text-center text-primary font-bold text-sm hover:underline"
                  >
                    Resend OTP or Change Number
                  </button>
                </div>
              </form>
            </Form>
          )}

          <div className="mt-10 space-y-4">
             <Alert className="bg-green-50 border-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-xs font-bold text-green-800">Blaze Plan Enabled</AlertTitle>
                <AlertDescription className="text-[10px] text-green-700">
                  Real SMS is active. For faster testing, add your phone number as a "Test Number" in Firebase Console.
                </AlertDescription>
             </Alert>
          </div>

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
