import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';

/** Rodapé fixo em todas as páginas: Termos, Privacidade e aviso do YouTube (exigência da API). */
export default function SiteFooter() {
  const { tr } = useI18n();
  const { pathname } = useLocation();
  // A tela de cantar ocupa a tela toda; o rodapé fica fora dela
  if (pathname.startsWith('/play/')) return null;

  return (
    <footer className="bg-black border-t border-white/10 px-4 py-8 text-center text-[11px] text-gray-500">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
        <Link to="/terms" className="hover:text-cyan-400">{tr('Termos de Uso', 'Terms of Use')}</Link>
        <Link to="/privacy" className="hover:text-cyan-400">{tr('Privacidade', 'Privacy')}</Link>
        <a href="mailto:contato@karaokeprime.com" className="hover:text-cyan-400">{tr('Contato', 'Contact')}</a>
      </nav>
      <p>
        {tr('Vídeos fornecidos pelo YouTube.', 'Videos provided by YouTube.')}{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">
          {tr('Termos do YouTube', 'YouTube Terms')}
        </a>
      </p>
      <p className="mt-2">© {new Date().getFullYear()} Karaoke Prime</p>
    </footer>
  );
}
