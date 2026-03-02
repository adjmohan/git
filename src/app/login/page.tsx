"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ 
        title: "Login Successful", 
        description: "Welcome back to Flipkart!" 
      });
      router.push('/');
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Login to your account
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Enter your credentials to continue shopping.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-400">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="Enter Email" 
                          {...field} 
                          className="rounded-none border-t-0 border-x-0 border-b-2 focus-visible:ring-0 focus:border-primary px-7" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-400">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="Enter Password" 
                          {...field} 
                          className="rounded-none border-t-0 border-x-0 border-b-2 focus-visible:ring-0 focus:border-primary px-7" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 space-y-4">
                 <p className="text-[10px] text-gray-400 font-medium text-center md:text-left">
                  By continuing, you agree to Flipkart's <span className="text-primary font-bold cursor-pointer">Terms of Use</span> and <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>.
                 </p>
                 <Button 
                   type="submit"
                   disabled={isLoading}
                   size="lg"
                   className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 rounded-sm uppercase tracking-wider shadow-lg"
                 >
                   {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Login'}
                 </Button>
              </div>
            </form>
          </Form>

          <div className="mt-8">
             <Alert className="bg-blue-50 border-blue-100">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="text-xs font-bold text-primary uppercase tracking-tight">Secure Login</AlertTitle>
                <AlertDescription className="text-[10px] text-primary/80 font-medium">
                  Your credentials are encrypted and stored securely. We never share your personal data.
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

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
