import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n';

/**
 * Termos de Uso e Política de Privacidade (PT/EN).
 * Atende às exigências das Políticas para Desenvolvedores dos Serviços de API
 * do YouTube (seção III.A): link e aceite dos Termos do YouTube, aviso de uso
 * da API, link da Política de Privacidade do Google, dados coletados, uso,
 * compartilhamento e armazenamento no dispositivo.
 * Rascunho para revisão jurídica (cronograma 1.3 / 3.3).
 */

const UPDATED = { pt: '19 de novembro de 2026', en: 'November 19, 2026' };
const CONTACT = 'contato@karaokeprime.com';
const YT_TERMS = 'https://www.youtube.com/t/terms';
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';

type Section = { title: string; body: React.ReactNode[] };

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2">
    {children}
  </a>
);

function termsSections(lang: 'pt' | 'en'): Section[] {
  if (lang === 'en') {
    return [
      { title: '1. Acceptance', body: ['By using karaokeprime.com ("Karaoke Prime", "we") you agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the service.'] },
      {
        title: '2. YouTube videos',
        body: [
          'Song videos shown on Karaoke Prime are provided by YouTube and played through the official YouTube player, using YouTube API Services. We do not host, own, copy or control these videos; all rights belong to their owners.',
          <>By using Karaoke Prime you also agree to be bound by the <A href={YT_TERMS}>YouTube Terms of Service</A>.</>,
          'Ads that appear inside the YouTube player are served by YouTube, not by us. Singing to YouTube videos on Karaoke Prime is always free.',
        ],
      },
      { title: '3. Your account', body: ['You may sign in with Google or with email and password. Keep your login secure; you are responsible for activity on your account. You must be at least 13 years old to create an account, and users under 18 need a parent or guardian’s permission to subscribe.'] },
      {
        title: '4. Prime subscription',
        body: [
          'The Prime plan unlocks the full Academy (all levels and exercises) and related features. Prices are shown on the Plans page before you pay.',
          'Payments are processed by Stripe. Subscriptions renew automatically at the end of each monthly or annual period until you cancel. You can cancel at any time; you keep access until the end of the period you already paid for. Refunds follow applicable law.',
        ],
      },
      { title: '5. Acceptable use', body: ['Do not download, record, re-upload or redistribute YouTube videos through our service; do not try to block or hide YouTube ads or branding; do not attack, overload or reverse-engineer the service; and do not use it for illegal purposes. We may suspend accounts that break these rules.'] },
      { title: '6. Scores and vocal health', body: ['Pitch accuracy and scores are automatic estimates meant for practice and fun. They are not a professional evaluation. Vocal exercises should never hurt: stop if you feel pain or strain, and consult a qualified professional if problems continue.'] },
      { title: '7. Our content', body: ['The Karaoke Prime name, logo, Academy lessons, exercises and software are ours or licensed to us. You may use them only for personal, non-commercial practice.'] },
      { title: '8. Disclaimers and liability', body: ['The service is provided "as is", without warranties of any kind, to the extent permitted by law. To the extent permitted by law, we are not liable for indirect or consequential damages, and our total liability is limited to the amount you paid us in the 12 months before the claim.'] },
      { title: '9. Changes', body: ['We may update these Terms. We will post the new version here with a new date, and significant changes will be announced on the site. Continuing to use the service means you accept the updated Terms.'] },
      { title: '10. Contact', body: [<>Questions? Write to <A href={`mailto:${CONTACT}`}>{CONTACT}</A>.</>] },
    ];
  }
  return [
    { title: '1. Aceite', body: ['Ao usar o karaokeprime.com ("Karaoke Prime", "nós") você concorda com estes Termos e com a nossa Política de Privacidade. Se não concordar, não use o serviço.'] },
    {
      title: '2. Vídeos do YouTube',
      body: [
        'Os vídeos das músicas exibidos no Karaoke Prime são fornecidos pelo YouTube e tocam no player oficial do YouTube, por meio dos Serviços de API do YouTube. Nós não hospedamos, não copiamos e não controlamos esses vídeos; todos os direitos pertencem aos seus donos.',
        <>Ao usar o Karaoke Prime você também concorda com os <A href={YT_TERMS}>Termos de Serviço do YouTube</A>.</>,
        'Os anúncios que aparecem dentro do player são exibidos pelo YouTube, não por nós. Cantar com os vídeos do YouTube no Karaoke Prime é sempre gratuito.',
      ],
    },
    { title: '3. Sua conta', body: ['Você pode entrar com o Google ou com e-mail e senha. Mantenha seu acesso seguro; você é responsável pelo que acontece na sua conta. É preciso ter pelo menos 13 anos para criar conta, e menores de 18 precisam da autorização de um responsável para assinar.'] },
    {
      title: '4. Assinatura Prime',
      body: [
        'O plano Prime libera o Academy completo (todos os níveis e exercícios) e recursos relacionados. Os preços aparecem na página de Planos antes do pagamento.',
        'Os pagamentos são processados pela Stripe. A assinatura renova automaticamente ao fim de cada período mensal ou anual até você cancelar. Você pode cancelar quando quiser e mantém o acesso até o fim do período já pago. Reembolsos seguem a lei aplicável.',
      ],
    },
    { title: '5. Uso permitido', body: ['Não baixe, grave, republique ou redistribua vídeos do YouTube pelo nosso serviço; não tente bloquear ou esconder anúncios ou a marca do YouTube; não ataque, sobrecarregue ou faça engenharia reversa do serviço; e não o use para fins ilegais. Podemos suspender contas que descumprirem essas regras.'] },
    { title: '6. Pontuação e saúde vocal', body: ['A afinação e os pontos são estimativas automáticas para prática e diversão, não uma avaliação profissional. Exercícios vocais nunca devem doer: pare se sentir dor ou esforço e procure um profissional qualificado se o problema continuar.'] },
    { title: '7. Nosso conteúdo', body: ['O nome e a marca Karaoke Prime, as aulas e exercícios do Academy e o software são nossos ou licenciados para nós. Você pode usá-los apenas para prática pessoal, sem fins comerciais.'] },
    { title: '8. Garantias e responsabilidade', body: ['O serviço é oferecido "como está", sem garantias, na medida permitida pela lei. Na medida permitida pela lei, não respondemos por danos indiretos, e nossa responsabilidade total fica limitada ao valor que você nos pagou nos 12 meses anteriores à reclamação.'] },
    { title: '9. Alterações', body: ['Podemos atualizar estes Termos. A nova versão será publicada aqui com nova data, e mudanças importantes serão avisadas no site. Continuar usando o serviço significa aceitar os Termos atualizados.'] },
    { title: '10. Contato', body: [<>Dúvidas? Escreva para <A href={`mailto:${CONTACT}`}>{CONTACT}</A>.</>] },
  ];
}

function privacySections(lang: 'pt' | 'en'): Section[] {
  if (lang === 'en') {
    return [
      {
        title: '1. YouTube API Services',
        body: [
          'Karaoke Prime uses YouTube API Services to search for songs and to play videos in the official YouTube player. We do not access your YouTube account or any private YouTube data.',
          <>YouTube is a Google service; when you watch videos, Google’s privacy practices apply: <A href={GOOGLE_PRIVACY}>Google Privacy Policy</A>.</>,
        ],
      },
      {
        title: '2. What we collect',
        body: [
          'Account: your name, email and profile photo (from Google sign-in or the sign-up form).',
          'Progress: Academy level, XP and best score, so you can track your progress.',
          'Subscription: plan status and Stripe customer and subscription IDs. Card details are handled by Stripe; we never see or store card numbers.',
          'Searches: the song names you search are sent from our server to YouTube to return results. They are not linked to your account.',
        ],
      },
      {
        title: '3. Microphone and camera',
        body: ['Your microphone is used only to measure your pitch, live, inside your browser. Your voice is never recorded, stored or sent to our servers. The camera is optional, off by default, shown only on your screen and never recorded.'],
      },
      {
        title: '4. How we use and share data',
        body: [
          'We use your data to run your account, save your progress, process your subscription, keep the service secure and answer your messages.',
          'We share data only with providers that run the service for us: Supabase (database and login), Vercel (hosting), Stripe (payments) and Google/YouTube (sign-in and videos). We do not sell or rent your personal information, and we do not share it for cross-context behavioral advertising.',
        ],
      },
      {
        title: '5. Cookies and device storage',
        body: [
          'We store small items in your browser (local storage) to keep you signed in and to remember your language and microphone choice. We do not use advertising cookies.',
          'Third parties may serve content, including ads, inside the YouTube player, and YouTube may set its own cookies under the Google Privacy Policy.',
        ],
      },
      { title: '6. Retention and security', body: ['We keep your data while your account is active. If you delete your account, we remove your personal data within 30 days, except what we must keep by law (for example, payment records). Data is encrypted in transit, and access to our systems is restricted.'] },
      { title: '7. Your rights', body: [<>You can ask to access, correct, download or delete your data at any time by writing to <A href={`mailto:${CONTACT}`}>{CONTACT}</A>. California residents have the rights described in the CCPA/CPRA, including the right to know, delete and correct, and the right not to be discriminated against for using them. We respond within 45 days.</>] },
      { title: '8. Children', body: ['Karaoke Prime is not directed to children under 13, and we do not knowingly collect their personal information. If we learn that a child under 13 created an account, we will delete it. Parents can contact us at any time.'] },
      { title: '9. Changes and contact', body: [<>We will post any changes to this policy here with a new date. Questions: <A href={`mailto:${CONTACT}`}>{CONTACT}</A>.</>] },
    ];
  }
  return [
    {
      title: '1. Serviços de API do YouTube',
      body: [
        'O Karaoke Prime usa os Serviços de API do YouTube para buscar músicas e tocar os vídeos no player oficial do YouTube. Não acessamos sua conta do YouTube nem dados privados do YouTube.',
        <>O YouTube é um serviço do Google; ao assistir aos vídeos, valem as práticas de privacidade do Google: <A href={GOOGLE_PRIVACY}>Política de Privacidade do Google</A>.</>,
      ],
    },
    {
      title: '2. O que coletamos',
      body: [
        'Conta: seu nome, e-mail e foto de perfil (do login com Google ou do cadastro).',
        'Progresso: nível no Academy, XP e melhor nota, para você acompanhar sua evolução.',
        'Assinatura: situação do plano e identificadores de cliente e assinatura da Stripe. Os dados do cartão ficam com a Stripe; nunca vemos nem guardamos números de cartão.',
        'Buscas: os nomes das músicas que você busca saem do nosso servidor para o YouTube trazer os resultados, sem ligação com a sua conta.',
      ],
    },
    {
      title: '3. Microfone e câmera',
      body: ['O microfone é usado só para medir sua afinação, ao vivo, dentro do seu navegador. Sua voz nunca é gravada, armazenada ou enviada aos nossos servidores. A câmera é opcional, vem desligada, aparece só na sua tela e nunca é gravada.'],
    },
    {
      title: '4. Como usamos e compartilhamos',
      body: [
        'Usamos seus dados para manter sua conta, salvar seu progresso, processar a assinatura, proteger o serviço e responder às suas mensagens.',
        'Compartilhamos dados apenas com fornecedores que operam o serviço para nós: Supabase (banco de dados e login), Vercel (hospedagem), Stripe (pagamentos) e Google/YouTube (login e vídeos). Não vendemos nem alugamos seus dados pessoais e não os compartilhamos para publicidade comportamental.',
      ],
    },
    {
      title: '5. Cookies e armazenamento no aparelho',
      body: [
        'Guardamos pequenas informações no seu navegador (armazenamento local) para manter você conectado e lembrar seu idioma e o microfone escolhido. Não usamos cookies de publicidade.',
        'Terceiros podem exibir conteúdo, inclusive anúncios, dentro do player do YouTube, e o YouTube pode usar cookies próprios conforme a Política de Privacidade do Google.',
      ],
    },
    { title: '6. Guarda e segurança', body: ['Mantemos seus dados enquanto sua conta estiver ativa. Se você excluir a conta, apagamos seus dados pessoais em até 30 dias, exceto o que a lei exige guardar (por exemplo, registros de pagamento). Os dados trafegam criptografados e o acesso aos nossos sistemas é restrito.'] },
    { title: '7. Seus direitos', body: [<>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados a qualquer momento pelo e-mail <A href={`mailto:${CONTACT}`}>{CONTACT}</A>. Residentes da Califórnia têm os direitos previstos na CCPA/CPRA (saber, excluir e corrigir, sem discriminação por exercê-los), e residentes no Brasil, os da LGPD. Respondemos em até 45 dias.</>] },
    { title: '8. Crianças', body: ['O Karaoke Prime não é direcionado a menores de 13 anos e não coletamos conscientemente dados deles. Se soubermos que uma criança menor de 13 criou conta, ela será excluída. Pais e responsáveis podem nos contatar a qualquer momento.'] },
    { title: '9. Alterações e contato', body: [<>Mudanças nesta política serão publicadas aqui com nova data. Dúvidas: <A href={`mailto:${CONTACT}`}>{CONTACT}</A>.</>] },
  ];
}

export default function Legal({ page }: { page: 'terms' | 'privacy' }) {
  const navigate = useNavigate();
  const { lang, tr } = useI18n();
  const sections = page === 'terms' ? termsSections(lang) : privacySections(lang);
  const title = page === 'terms' ? tr('Termos de Uso', 'Terms of Use') : tr('Política de Privacidade', 'Privacy Policy');

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <article className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={16} /> {tr('Voltar', 'Back')}
        </button>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">{title}</h1>
        <p className="text-xs text-gray-500 mb-10">
          {tr('Última atualização', 'Last updated')}: {UPDATED[lang]}
        </p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-black text-white mb-3">{section.title}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-sm text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
