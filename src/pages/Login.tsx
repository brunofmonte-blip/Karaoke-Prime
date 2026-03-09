// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR NO ARQUIVO src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 AS CHAVES DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID" // 👈 Pode colocar ele aqui no final!
};

// Inicializando os serviços do Firebase
const app = initializeApp(firebaseConfig);

// Exportando para usarmos no resto do aplicativo
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();