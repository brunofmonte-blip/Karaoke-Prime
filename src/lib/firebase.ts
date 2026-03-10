import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. As suas chaves públicas entram aqui (pode usar strings diretas ou import.meta.env se estiver a usar variáveis de ambiente):
const firebaseConfig = {
  apiKey: "A_SUA_API_KEY",
  authDomain: "O_SEU_AUTH_DOMAIN",
  projectId: "O_SEU_PROJECT_ID",
  storageBucket: "O_SEU_STORAGE_BUCKET",
  messagingSenderId: "O_SEU_MESSAGING_SENDER_ID",
  appId: "O_SEU_APP_ID",
  measurementId: "O_SEU_MEASUREMENT_ID"
};

// 2. Inicializa a Aplicação
const app = initializeApp(firebaseConfig);

// 3. Exportações vitais para o Login e Academy funcionarem! (ISTO É O QUE O FIREBASE NÃO MOSTRA)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();