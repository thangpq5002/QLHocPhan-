// src/firebase/config.ts

import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-bUrqheK-oJga1mkRcfYKFyAcjcrHmU0",
  authDomain: "lhocphan-9c75c.firebaseapp.com",
  projectId: "lhocphan-9c75c",
  storageBucket: "lhocphan-9c75c.firebasestorage.app",
  messagingSenderId: "432112042712",
  appId: "1:432112042712:web:0b9b0eeba224d41d020dad",
  measurementId: "G-QRQL5JZ0CZ",
};

// Tránh khởi tạo Firebase nhiều lần
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);

// Khởi tạo Firebase Storage
export const storage = getStorage(app);

// Khởi tạo Firebase Authentication
// Lưu trạng thái đăng nhập bằng AsyncStorage
let authInstance;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Nếu Auth đã được khởi tạo trước đó (Fast Refresh)
  authInstance = getAuth(app);
}

export const auth = authInstance;
