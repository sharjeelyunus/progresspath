import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth, db, provider } from '../config/firebase';
import { UserType } from '../interfaces';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type authContextType = {
  user: UserType | null;
  loggedInUser: UserType | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
};

const authContextDefaultValues: authContextType = {
  user: null,
  loggedInUser: null,
  login: () => {},
  logout: () => {},
  loading: true,
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType>();
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName,
          onboarding: false,
          metadata: {
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime,
          },
        });
      } else {
        setUser(null);
        setLoggedInUser(null);
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // loggedInUser is the user from the database
    const syncUser = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userData = (await getDoc(userRef)).data();
        if (userData) {
          setLoggedInUser(userData as UserType);
        }
      }
    };
    syncUser();
  }, [user]);

  useEffect(() => {
    const syncUser = async () => {
      if (user && !loggedInUser) {
        // Only sync user data if loggedInUser is not set yet
        const userRef = doc(db, 'users', user.uid);
        const userData = (await getDoc(userRef)).data();
        if (userData) {
          setLoggedInUser(userData as UserType);
        }
      }
    };
    syncUser();
  }, [user, loggedInUser]);

  const handleAddNewUser = async (result: UserCredential) => {
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const userDetails: UserType = {
      email: user?.email,
      uid: user?.uid,
      photoURL: user?.photoURL,
      name: user?.displayName,
      onboarding: false,
      metadata: {
        lastSignInTime: user?.metadata.lastSignInTime,
        creationTime: user?.metadata.creationTime,
      },
    };
    await setDoc(userRef, userDetails, { merge: true });
  };

  const handleUpdateUserMetadata = async (result: UserCredential) => {
    const user = result.user;
    const userRef = doc(db, 'users', user?.uid);
    const userDetails = {
      metadata: {
        lastSignInTime: user?.metadata.lastSignInTime,
        creationTime: user?.metadata.creationTime,
      },
    };
    await setDoc(userRef, userDetails, { merge: true });
    toast.success('Welcome back');
  };

  const login = () => {
    signInWithPopup(auth, provider)
      // add user to database
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        async () => {
          const userRef = doc(db, 'users', user.uid);
          const userDataExists = (await getDoc(userRef)).exists();
          // check if user already exists in database
          if (userDataExists) {
            // if yes, update user's metadata
            handleUpdateUserMetadata(result);
          } else {
            // if not, add user to database
            handleAddNewUser(result);
          }
        };
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });
      });
  };

  const logout = () => {
    auth.signOut();
  };

  const value = {
    user,
    loggedInUser,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
