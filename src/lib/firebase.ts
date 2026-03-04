// Configuração fantasma para o site ignorar o Firebase e usar o Supabase em paz
export const firebaseConfig = {};

export const auth: any = {
  // Entregamos a função exata que o site está procurando
  onAuthStateChanged: (callback: any) => {
    callback(null); // Avisa ao site: "Não tem ninguém logado aqui"
    return () => {}; // Função vazia de segurança
  },
  currentUser: null
};

export const db: any = {};

export const googleProvider: any = {};

export default firebaseConfig;