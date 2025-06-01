
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if the API key is loaded. If not, Firebase will fail.
if (!firebaseConfig.apiKey) {
  throw new Error(
    'Firebase API Key is missing. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file and that you have restarted your development server.'
  );
}

// Check if the Auth Domain is loaded. If not, Firebase will fail.
if (!firebaseConfig.authDomain) {
  throw new Error(
    'Firebase Auth Domain is missing. Please ensure NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set in your .env.local file (e.g., your-project-id.firebaseapp.com) and that you have restarted your development server.'
  );
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

const auth = getAuth(app);

// If running in development and Firebase emulator is running, connect to it.
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  // Ensure host is '127.0.0.1' for Firebase Auth Emulator if not using default 'localhost'
  // connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}

export { app, auth };
