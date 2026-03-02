
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInAnonymously, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token found.');
      return;
    }

    const processLogin = async () => {
      try {
        // Since Phone.Email handles verification externally, 
        // for the prototype we use Anonymous Sign-in to establish a Firebase session
        // and link the verified metadata. In production, you'd verify the token on the server.
        const userCredential = await signInAnonymously(auth);
        const firebaseUser = userCredential.user;

        // In a real app, you would fetch user details from Phone.Email using the token here
        // For the prototype, we assume success and set up the profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          setDocumentNonBlocking(userRef, {
            id: firebaseUser.uid,
            authType: 'phone_email',
            verifiedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }

        setStatus('success');
        toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
        
        setTimeout(() => {
          router.push('/profile');
        }, 2000);

      } catch (error: any) {
        console.error("Login processing error:", error);
        setStatus('error');
        setErrorMessage(error.message || "Failed to finalize login.");
      }
    };

    processLogin();
  }, [searchParams, auth, db, router]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h1 className="text-xl font-bold">Verifying your login...</h1>
            <p className="text-gray-500">Please wait while we finalize your secure session.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 animate-bounce" />
            <h1 className="text-xl font-bold text-green-600">Verified!</h1>
            <p className="text-gray-500">You have been logged in successfully. Redirecting...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-12 h-12 text-destructive" />
            <h1 className="text-xl font-bold text-destructive">Verification Failed</h1>
            <p className="text-gray-500">{errorMessage}</p>
            <button 
              onClick={() => router.push('/login')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
