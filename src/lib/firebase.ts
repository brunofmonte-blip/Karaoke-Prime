import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmJaH9jZUqI2fGQV_yAYC-8w8t3RmvrlI",
  authDomain: "karaoke-prime-4f59e.firebaseapp.com",
  projectId: "karaoke-prime-4f59e",
  storageBucket: "karaoke-prime-4f59e.firebasestorage.app",
  messagingSenderId: "1019002450289",
  appId: "1:1019002450289:web:fd3801c55b5bdeb2c906d0",
  measurementId: "G-H3J972N7FM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();