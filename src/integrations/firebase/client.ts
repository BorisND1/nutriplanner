
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "appli-web1.firebaseapp.com",
  projectId: "appli-web1",
  storageBucket: "appli-web1.firebasestorage.app",
  messagingSenderId: "586705547873",
  appId: "1:586705547873:web:257ee6476ae31b3081f020"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firebase Cloud Messaging
export const messaging = getMessaging(app);

export default app;
