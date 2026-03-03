import type { FirebaseOptions } from 'firebase/app';

const fallbackConfig: FirebaseOptions = {
  projectId: 'studio-961301210-fbd37',
  appId: '1:365251771295:web:8a67f6ba794cd97aa0dbaa',
  apiKey: 'AIzaSyAHiGQ9mgwuRmoUNvp89KNkq223mr0HB4s',
  authDomain: 'studio-961301210-fbd37.firebaseapp.com',
  messagingSenderId: '365251771295',
};

const envConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys: Array<keyof FirebaseOptions> = ['apiKey', 'authDomain', 'projectId'];
const hasRequiredEnv = requiredKeys.every((key) => !!envConfig[key]);

export const firebaseConfig: FirebaseOptions = hasRequiredEnv ? envConfig : fallbackConfig;