import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. As suas chaves públicas entram aqui (pode usar strings diretas ou import.meta.env se estiver a usar variáveis de ambiente):
const firebaseConfig = {
  apiKey: "AIzaSyDmJaH9jZUqI2fGQV_yAYC-8w8t3RmvrlI",
  authDomain: "karaoke-prime-4f59e.firebaseapp.com",
  projectId: "karaoke-prime-4f59e",
  storageBucket: "karaoke-prime-4f59e.firebasestorage.app",
  messagingSenderId: "1019002450289",
  appId: "1:1019002450289:web:fd3801c55b5bdeb2c906d0",
  measurementId: "G-H3J972N7FM"
};

// 2. Inicializa a Aplicação
const app = initializeApp(firebaseConfig);

// 3. Exportações vitais para o Login e Academy funcionarem! (ISTO É O QUE O FIREBASE NÃO MOSTRA)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();