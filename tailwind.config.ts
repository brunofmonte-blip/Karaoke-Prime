@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Fundo Totalmente Preto e Texto Branco */
    --background: 0 0% 0%;
    --foreground: 210 40% 98%;

    --card: 0 0% 0%;
    --card-foreground: 210 40% 98%;

    --popover: 0 0% 0%;
    --popover-foreground: 210 40% 98%;

    /* Cyan-400 Neon: HSL(191, 91%, 54%) */
    --primary: 191 91% 54%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 191 91% 54%;

    --radius: 0.5rem;

    /* Variáveis da Sidebar para evitar conflito com o config */
    --sidebar-background: 0 0% 0%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 191 91% 54%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 191 91% 54%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
} 