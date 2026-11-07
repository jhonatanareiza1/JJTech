// ==========================================
// JJ TECH - AUTHENTICATION & ROLE MANAGEMENT CONTEXT
// ==========================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConnected } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { dataService } from '../services/dataService';

const AuthContext = createContext();

export const MASTER_ADMIN_KEYS = ["JJTECH2026", "JJTECH-ADMIN", "JJTECH-MASTER", "admin"];

const isMasterOwnerEmail = (email = "") => {
  const clean = email.trim().toLowerCase();
  return (
    clean === "jhonatanareiza1@hotmail.com" || 
    clean === "admin@jjtech.com" || 
    clean.endsWith("@jjtech.com") ||
    clean.includes("areiza")
  );
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

  const [usersList, setUsersList] = useState(() => dataService.getUsers());
  const [accessLogs, setAccessLogs] = useState(() => dataService.getAccessLogs());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sincronización en tiempo real con Firestore para usuarios y logs
  useEffect(() => {
    const unsub = dataService.subscribeToCloudSync((cloudData) => {
      if (cloudData.users) {
        setUsersList(cloudData.users);
        // Si el usuario actual fue actualizado en Firestore, sincronizar su rol en vivo
        if (currentUser) {
          const fresh = cloudData.users.find(u => 
            u.id === currentUser.id || 
            u.email?.toLowerCase() === currentUser.email?.toLowerCase()
          );
          if (fresh && fresh.role !== currentUser.role) {
            setCurrentUser(prev => ({ ...prev, role: fresh.role }));
          }
        }
      }
      if (cloudData.accessLogs) {
        setAccessLogs(cloudData.accessLogs);
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jjtech_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jjtech_auth_user');
    }
  }, [currentUser]);

  // Login de Administrador (Permite al dueño, correos delegados o usuarios con clave maestra)
  const loginAdmin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isOwner = isMasterOwnerEmail(cleanEmail);
      const isKeyMatch = MASTER_ADMIN_KEYS.includes(password.trim());

      // Buscar si el usuario ya está registrado en la base de datos
      const existingUser = usersList.find(u => u.email?.toLowerCase() === cleanEmail);
      const isRegisteredAdmin = existingUser?.role === 'admin';

      if (isOwner || isRegisteredAdmin || (cleanEmail === "admin@jjtech.com" && password === "admin") || isKeyMatch) {
        const user = {
          id: existingUser?.id || (cleanEmail === "admin@jjtech.com" ? "admin-jjtech-01" : `user-${Date.now()}`),
          uid: existingUser?.id || `user-${Date.now()}`,
          email: cleanEmail,
          displayName: existingUser?.displayName || (isOwner ? "Jhonatan Areiza (Fundador JJ Tech)" : cleanEmail.split('@')[0]),
          phone: existingUser?.phone || "302 576 9589",
          city: existingUser?.city || "Medellín",
          role: "admin",
          isVerified: true
        };

        // Guardar/actualizar en Firestore y memoria
        await dataService.saveUser(user);
        await dataService.recordAccessLog(user, "Ingreso a Consola Administrativa");

        setCurrentUser(user);
        setUsersList(dataService.getUsers());
        setAccessLogs(dataService.getAccessLogs());
        setAuthLoading(false);
        return { success: true, user };
      } else {
        throw new Error("Este usuario no tiene permisos de Administrador. Si eres el dueño, usa tu correo registrado o ingresa la llave de seguridad.");
      }
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Login Normal de Cliente o Administrador
  const loginClient = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isOwner = isMasterOwnerEmail(cleanEmail);
      const existingUser = usersList.find(u => u.email?.toLowerCase() === cleanEmail);
      
      // Si en la base de datos ya está como admin o es el dueño, se le otorga rol de admin
      const finalRole = (existingUser?.role === 'admin' || isOwner) ? 'admin' : 'client';

      let uid = existingUser?.id || `client-${Date.now()}`;

      if (isFirebaseConnected && auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          if (userCredential?.user) {
            uid = userCredential.user.uid;
          }
        } catch (fbErr) {
          console.warn("Firebase Auth login fallback local:", fbErr.message);
        }
      }

      const user = {
        id: uid,
        uid: uid,
        email: cleanEmail,
        displayName: existingUser?.displayName || cleanEmail.split('@')[0].toUpperCase(),
        phone: existingUser?.phone || '',
        city: existingUser?.city || 'Medellín',
        role: finalRole,
        lastLoginAt: new Date().toISOString()
      };

      await dataService.saveUser(user);
      await dataService.recordAccessLog(user, finalRole === 'admin' ? "Inicio de Sesión (Administrador)" : "Inicio de Sesión (Cliente)");

      setCurrentUser(user);
      setUsersList(dataService.getUsers());
      setAccessLogs(dataService.getAccessLogs());
      setAuthLoading(false);
      return { success: true, user };
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Registro de Usuario (Con opción de Llave Administrador para volverse Admin de inmediato)
  const registerClient = async (name, email, password, phone = "", city = "Medellín", adminKey = "") => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isOwner = isMasterOwnerEmail(cleanEmail);
      const hasValidKey = adminKey && MASTER_ADMIN_KEYS.includes(adminKey.trim());
      
      // Si el correo es el del dueño o puso la llave de admin, se crea inmediatamente como Administrador
      const role = (isOwner || hasValidKey) ? 'admin' : 'client';

      let uid = `user-${Date.now()}`;

      if (isFirebaseConnected && auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          if (cred && cred.user) {
            uid = cred.user.uid;
          }
        } catch (fbErr) {
          console.warn("Firebase Auth registration fallback local:", fbErr.message);
        }
      }

      const user = {
        id: uid,
        uid: uid,
        displayName: name,
        email: cleanEmail,
        phone: phone,
        city: city,
        role: role,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await dataService.saveUser(user);
      await dataService.recordAccessLog(user, role === 'admin' ? "Registro de Cuenta (Administrador Creado)" : "Registro de Cuenta (Cliente)");

      setCurrentUser(user);
      setUsersList(dataService.getUsers());
      setAccessLogs(dataService.getAccessLogs());
      setAuthLoading(false);
      return { success: true, user };
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Función para Delegar o Cambiar Rol de cualquier usuario (Admin <-> Cliente)
  const updateUserRole = async (userId, newRole) => {
    try {
      const updatedList = await dataService.updateUserRole(userId, newRole);
      setUsersList(updatedList);

      // Si el usuario modificado es el que está conectado actualmente
      if (currentUser && (currentUser.id === userId || currentUser.email === userId)) {
        setCurrentUser(prev => ({ ...prev, role: newRole }));
      }

      await dataService.recordAccessLog(
        currentUser || { email: "admin", displayName: "Administrador" },
        `Rol delegado: ${newRole.toUpperCase()} para usuario ID ${userId}`
      );
      setAccessLogs(dataService.getAccessLogs());
      return { success: true };
    } catch (err) {
      console.error("Error delegando rol:", err);
      return { success: false, error: err.message };
    }
  };

  // Reclamar Rol de Administrador para la sesión actual con la Llave Maestra
  const claimAdminRole = async (adminKey = "") => {
    if (!currentUser) return { success: false, error: "Debes iniciar sesión primero." };
    const cleanKey = adminKey.trim();
    if (MASTER_ADMIN_KEYS.includes(cleanKey) || isMasterOwnerEmail(currentUser.email)) {
      await updateUserRole(currentUser.id, 'admin');
      setCurrentUser(prev => ({ ...prev, role: 'admin' }));
      return { success: true };
    } else {
      return { success: false, error: "Llave de seguridad de Administrador inválida." };
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
        usersList,
        accessLogs,
        authLoading,
        authError,
        loginAdmin,
        loginClient,
        registerClient,
        updateUserRole,
        claimAdminRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
