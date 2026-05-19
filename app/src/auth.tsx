import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { get, ref, serverTimestamp, set, update } from 'firebase/database';
import { auth, database, googleProvider, isFirebaseConfigured, requestFirebaseNotificationToken } from './firebase';

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phone: string;
  notifications: {
    sms: boolean;
    whatsapp: boolean;
    browser: boolean;
    fcmToken?: string;
  };
  addresses: Address[];
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  saveNotificationPreferences: (preferences: UserProfile['notifications']) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createDefaultProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    phone: user.phoneNumber || '',
    notifications: {
      sms: true,
      whatsapp: true,
      browser: false,
    },
    addresses: [],
  };
}

function normalizeProfile(user: User, value: Partial<UserProfile> | null): UserProfile {
  const fallback = createDefaultProfile(user);
  const rawAddresses = value?.addresses;
  const addresses: Address[] = Array.isArray(rawAddresses)
    ? rawAddresses
    : Object.values(rawAddresses || {}) as Address[];

  return {
    ...fallback,
    ...value,
    uid: user.uid,
    displayName: value?.displayName || fallback.displayName,
    email: value?.email || fallback.email,
    photoURL: value?.photoURL || fallback.photoURL,
    notifications: {
      ...fallback.notifications,
      ...value?.notifications,
    },
    addresses,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !database) {
      setError('Firebase has an invalid or missing VITE_FIREBASE_API_KEY. Copy the Web app apiKey from Firebase Project settings into your .env file.');
      setLoading(false);
      return;
    }

    const activeAuth = auth;
    const activeDatabase = database;

    return onAuthStateChanged(activeAuth, async (nextUser) => {
      setUser(nextUser);
      setError(null);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const profileRef = ref(activeDatabase, `users/${nextUser.uid}/profile`);
        const snapshot = await get(profileRef);
        const nextProfile = normalizeProfile(nextUser, snapshot.val());
        await update(profileRef, {
          uid: nextUser.uid,
          displayName: nextProfile.displayName,
          email: nextProfile.email,
          photoURL: nextProfile.photoURL,
          lastLoginAt: serverTimestamp(),
        });
        setProfile(nextProfile);
      } catch (profileError) {
        console.warn('Unable to load profile:', profileError);
        setError('Could not load your profile. Please try again.');
        setProfile(createDefaultProfile(nextUser));
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    error,
    signInWithGoogle: async () => {
      if (!isFirebaseConfigured) {
        setError('Firebase has an invalid or missing VITE_FIREBASE_API_KEY. Copy the Web app apiKey from Firebase Project settings into your .env file.');
        return null;
      }
      if (!auth) {
        setError('Firebase Auth could not start. Check your Firebase Web app config.');
        return null;
      }

      setError(null);
      const credential = await signInWithPopup(auth, googleProvider);
      return credential.user;
    },
    logout: async () => {
      if (!isFirebaseConfigured || !auth) return;
      await signOut(auth);
    },
    saveProfile: async (nextProfile) => {
      if (!user) throw new Error('Sign in before saving your profile.');
      if (!database) throw new Error('Firebase Database is not configured.');
      const profileRef = ref(database, `users/${user.uid}/profile`);
      const payload = {
        ...nextProfile,
        uid: user.uid,
        email: user.email || nextProfile.email,
        updatedAt: serverTimestamp(),
      };
      await set(profileRef, payload);
      setProfile(payload as UserProfile);
    },
    saveNotificationPreferences: async (preferences) => {
      if (!user || !profile) throw new Error('Sign in before saving notification preferences.');
      if (!database) throw new Error('Firebase Database is not configured.');
      const fcmToken = preferences.browser ? await requestFirebaseNotificationToken() : undefined;
      const nextNotifications = {
        ...preferences,
        ...(fcmToken ? { fcmToken } : {}),
      };
      await update(ref(database, `users/${user.uid}/profile/notifications`), nextNotifications);
      setProfile({
        ...profile,
        notifications: nextNotifications,
      });
    },
  }), [error, loading, profile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
