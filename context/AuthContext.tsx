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
};

const authContextDefaultValues: authContextType = {
  user: null,
  loggedInUser: null,
  login: () => {},
  logout: () => {},
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
  const [userExists, setUserExists] = useState<boolean>(false);

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
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // check if user exists in database
    const syncUser = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDataExists = (await getDoc(userRef)).exists();
        if (userDataExists) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      }
    };
    syncUser();
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
      .then((result) => {
        // add user to database
        // check if user already exists in database
        if (userExists) {
          // if yes, update user's metadata
          handleUpdateUserMetadata(result);
        } else {
          // if not, add user to database
          handleAddNewUser(result);
        }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
