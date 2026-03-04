import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração fictícia para destravar a interface
const firebaseConfig = {
  apiKey: "dummy-api-key-para-destravar-tela",
  authDomain: "karaoke-prime-dummy.firebaseapp.com",
  projectId: "karaoke-prime-dummy",
  storageBucket: "karaoke-prime-dummy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();