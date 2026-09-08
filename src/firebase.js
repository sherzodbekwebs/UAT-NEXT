// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDBDD8VT6F6x-WqqdQ-rnaFbnqXZ7-D4jE",
  authDomain: "uzauto-trailer.firebaseapp.com",
  projectId: "uzauto-trailer",
  storageBucket: "uzauto-trailer.firebasestorage.app",
  messagingSenderId: "1037724810356",
  appId: "1:1037724810356:web:e85f9da121574b9aeaa521",
  measurementId: "G-9RNW2ZW0LR"
};

// Firebase-ni faqat bir marta initialize qilish uchun tekshiruv
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics faqat brauzerda (client-side) ishga tushadi
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };