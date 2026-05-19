import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nancypahuja-c777e.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://nancypahuja-c777e-default-rtdb.firebaseio.com/',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nancypahuja-c777e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nancypahuja-c777e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = /^AIza[0-9A-Za-z_-]{20,}$/.test(firebaseConfig.apiKey);

export const firebaseApp = isFirebaseConfigured
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
export const database = firebaseApp ? getDatabase(firebaseApp) : null;

export async function requestFirebaseNotificationToken(): Promise<string | null> {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!firebaseApp || !vapidKey || Notification.permission === 'denied') {
    return null;
  }

  const supported = await isSupported();
  if (!supported) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const messaging = getMessaging(firebaseApp);
    return await getToken(messaging, { vapidKey });
  } catch (error) {
    console.warn('Unable to create Firebase notification token:', error);
    return null;
  }
}
