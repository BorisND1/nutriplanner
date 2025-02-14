
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Configuration Firebase
const firebaseConfig = {
  apiKey: '', // À remplir
  authDomain: '', // À remplir
  projectId: '', // À remplir
  storageBucket: '', // À remplir
  messagingSenderId: '', // À remplir
  appId: '', // À remplir
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firebase Cloud Messaging
export const messaging = getMessaging(app);

export default app;
