// ==========================================
// JJ TECH - FIREBASE CONFIGURATION & HYBRID ENGINE
// ==========================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
const isConfigured = Boolean(
  rawApiKey &&
  rawApiKey.trim() !== "" &&
  !rawApiKey.includes("DummyKey") &&
  !rawApiKey.includes("tu_api_key")
);

const firebaseConfig = {
  apiKey: rawApiKey || "AIzaSyDummyKeyJJTechForLocalDevelopment1234",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jjtech-a3ab0.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://jjtech-a3ab0-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jjtech-a3ab0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jjtech-a3ab0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "415151085443",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:415151085443:web:99f911cb352e64a6fe88b6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-L53NG4R9MN"
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseConnected = false;

try {
  if (isConfigured) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConnected = true;
    console.log("☁️ JJ Tech: Conexión con Google Firebase establecida.");
  } else {
    // Modo Local / Demo
    console.info("⚡ JJ Tech: Ejecutando en Modo Local / Storage sin llaves de Firebase activas.");
    isFirebaseConnected = false;
  }
} catch (error) {
  console.warn("⚠️ Advertencia al iniciar Firebase (Modo Local habilitado):", error.message);
  isFirebaseConnected = false;
}

/**
 * Sube una imagen optimizada a Firebase Storage
 * Si Firebase no está configurado o falla, devuelve la imagen local / Base64 sin error.
 */
export const uploadMediaToStorage = async (fileOrDataUrl, path = `media/${Date.now()}`) => {
  if (!isFirebaseConnected || !storage) {
    return fileOrDataUrl;
  }

  const uploadTask = async () => {
    const storageRef = ref(storage, path);
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      await uploadString(storageRef, fileOrDataUrl, 'data_url');
      return await getDownloadURL(storageRef);
    } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
      await uploadBytes(storageRef, fileOrDataUrl);
      return await getDownloadURL(storageRef);
    }
    return fileOrDataUrl;
  };

  try {
    return await Promise.race([
      uploadTask(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout de conexión con Firebase Storage")), 3500))
    ]);
  } catch (error) {
    console.warn("Aviso Firebase Storage (se conservará la versión local optimizada):", error.message);
    return fileOrDataUrl;
  }
};

export { app, auth, db, storage, isFirebaseConnected };
