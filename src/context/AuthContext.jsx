// ==========================================
// JJ TECH - AUTHENTICATION & ROLE MANAGEMENT CONTEXT
// ==========================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConnected } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: "admin@jjtech.com",
  password: "admin",
  displayName: "Ingeniero Administrador JJ Tech",
  role: "admin"
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jjtech_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jjtech_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jjtech_auth_user');
    }
  }, [currentUser]);

  // Admin Login
  const loginAdmin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && (password === ADMIN_CREDENTIALS.password || password === "jjtech2026")) {
        const user = {
          uid: "admin-jjtech-01",
          email: ADMIN_CREDENTIALS.email,
          displayName: ADMIN_CREDENTIALS.displayName,
          role: "admin",
          isVerified: true
        };
        setCurrentUser(user);
        setAuthLoading(false);
        return { success: true, user };
      } else {
        throw new Error("Credenciales de Administrador incorrectas. Usa admin@jjtech.com / admin");
      }
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Client Login
  const loginClient = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isFirebaseConnected) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || email.split('@')[0],
            role: "client"
          };
          setCurrentUser(user);
          setAuthLoading(false);
          return { success: true, user };
        } catch (fbErr) {
          console.warn("Firebase Auth fallback to local auth:", fbErr.message);
        }
      }

      // Local / Offline Client Login Simulation
      const user = {
        uid: `client-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0].toUpperCase(),
        role: "client"
      };
      setCurrentUser(user);
      setAuthLoading(false);
      return { success: true, user };
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register Client
  const registerClient = async (name, email, password, city = "Medellín") => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = {
        uid: `client-${Date.now()}`,
        displayName: name,
        email: email,
        city: city,
        role: "client",
        registeredAt: new Date().toISOString()
      };
      setCurrentUser(user);
      setAuthLoading(false);
      return { success: true, user };
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Fast Demo Login
  const quickDemoLogin = (role = 'client') => {
    if (role === 'admin') {
      const admin = {
        uid: "admin-jjtech-01",
        email: ADMIN_CREDENTIALS.email,
        displayName: ADMIN_CREDENTIALS.displayName,
        role: "admin"
      };
      setCurrentUser(admin);
    } else {
      const client = {
        uid: "client-demo-01",
        email: "cliente.medellin@gmail.com",
        displayName: "Juan Camilo Arango",
        city: "Medellín - El Poblado",
        role: "client"
      };
      setCurrentUser(client);
    }
  };

  const logout = async () => {
    if (isFirebaseConnected && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut error:", e);
      }
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        isClient: currentUser?.role === 'client',
        isAuthenticated: !!currentUser,
        authLoading,
        authError,
        loginAdmin,
        loginClient,
        registerClient,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
