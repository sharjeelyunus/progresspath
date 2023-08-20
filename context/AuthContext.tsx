import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth, db, provider } from '../config/firebase';
import { UserType } from '../interfaces';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthContextType = {
  user: UserType | null;
  loggedInUser: UserType | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          email: user.email!,
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName,
        });

        // Fetch user data from the database
        const userRef = doc(db, 'users', user.uid);
        const userData = (await getDoc(userRef)).data() as UserType | undefined;

        if (userData) {
          setLoggedInUser({
            ...userData,
            uid: user.uid,
          });
        }
      } else {
        setUser(null);
        setLoggedInUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (result: UserCredential) => {
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      // New user, add to database
      const userDetails: UserType = {
        email: user.email!,
        uid: user.uid,
        photoURL: user.photoURL,
        name: user.displayName,
        onboarding: true, // Set to true for new users
        metadata: {
          lastSignInTime: user.metadata.lastSignInTime,
          creationTime: user.metadata.creationTime,
        },
      };

      await setDoc(userRef, userDetails, { merge: true });
      toast.success('Welcome to ProgressPath');
      setLoggedInUser(userDetails); // Update loggedInUser with new user details
    } else {
      // Existing user, update metadata
      const userDetails = {
        metadata: {
          lastSignInTime: user.metadata.lastSignInTime,
          creationTime: user.metadata.creationTime,
        },
      };

      await setDoc(userRef, userDetails, { merge: true });
      toast.success('Welcome back');
      const existingUserData = {
        ...userSnapshot.data(),
        uid: user.uid,
      } as UserType;
      setLoggedInUser(existingUserData);
    }
  };

  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => handleLogin(result))
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log({ errorCode, errorMessage });
      });
  };

  const logout = () => {
    auth.signOut();
  };

  const contextValue: AuthContextType = {
    user,
    loggedInUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
