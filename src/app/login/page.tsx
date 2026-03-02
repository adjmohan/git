
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
import { doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Info, Loader2, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (error) {
        console.error("Recaptcha init error:", error);
      }
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
      toast({ title: "OTP Sent", description: "Verification code sent to your mobile." });
    } catch (error: any) {
      console.error("Phone sign-in error:", error);
      let message = "Could not send OTP. Please try again.";
      
      if (error.code === 'auth/operation-not-allowed') {
        message = "Phone auth not enabled. Please enable it in Firebase Console.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many attempts. Please try again later.";
      } else if (error.message?.toLowerCase().includes('billing')) {
        message = "Firebase requires a Blaze plan for SMS. Use a test number if developing.";
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

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        setDocumentNonBlocking(userRef, {
          id: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({ title: "Login Successful", description: "Welcome back to Flipkart!" });
      router.push('/profile');
    } catch (error: any) {
      console.error("OTP Verification error:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The verification code entered is incorrect.",
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
               alt="Login Banner" 
               className="w-full h-auto object-contain opacity-60" 
             />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-10 flex-grow flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {step === 'phone' ? 'Mobile Login' : 'Verify OTP'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 'phone' 
                ? 'Enter your mobile number to receive a one-time password.' 
                : `Enter the 6-digit code sent to +91 ${phoneForm.getValues('phoneNumber')}`}
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
                      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary transition-colors">
                        <span className="text-gray-500 font-bold px-2">+91</span>
                        <FormControl>
                          <Input 
                            placeholder="Enter 10-digit mobile number" 
                            {...field} 
                            className="border-none focus-visible:ring-0 rounded-none h-12 text-lg font-medium p-0" 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <p className="text-[10px] text-gray-400">
                    By continuing, you agree to Flipkart's <span className="text-primary font-bold">Terms of Use</span> and <span className="text-primary font-bold">Privacy Policy</span>.
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
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel className="text-xs font-bold text-gray-500 self-start">Enter 6-digit OTP</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
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
                      <FormDescription className="text-xs">
                        Input the code sent via SMS.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
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

          <div className="mt-8 space-y-4">
             <div className="bg-green-50 border border-green-100 p-3 rounded flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-green-800">
                    Blaze billing detected. Real SMS is enabled. Ensure Authorized Domains are set in Firebase.
                </p>
             </div>
             
             <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-xs font-bold uppercase tracking-wider">Developer Tip</AlertTitle>
                <AlertDescription className="text-[10px]">
                  Add your number as a "Test Phone Number" in Firebase Console to bypass SMS costs and reCAPTCHA during development.
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
