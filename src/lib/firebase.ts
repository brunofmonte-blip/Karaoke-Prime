// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR NO ARQUIVO src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 AQUI ENTRAM AS CHAVES DO SEU PROJETO FIREBASE
// Substitua os valores abaixo pelas chaves reais do seu Console do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializando os serviços do Firebase
const app = initializeApp(firebaseConfig);

// Exportando para usarmos no resto do aplicativo
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();