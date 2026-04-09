import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { ChefHat, ArrowRight, ClipboardList, BookOpen, Package } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--surface)' }}>

      {/* Header — glassmorphism 24px */}
      <header className="glass fixed top-0 w-full z-50 px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #fbabbc 0%, #ffdcc2 100%)' }}
          >
            <ChefHat className="w-4 h-4" style={{ color: '#915160' }} />
          </div>
          <span
            className="font-bold text-base tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}
          >
            Artisan Baker Pro
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard" className="btn-primary flex items-center gap-2">
              Ir para o Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="text-sm font-medium transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}
              >
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">Começar agora</button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </header>

      <main className="flex-1 pt-16">

        {/* Hero — assimetria editorial (Stitch spec) */}
        <section className="relative overflow-hidden px-6 lg:px-12 py-24 lg:py-36">
          {/* Background gradient blob */}
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #fbabbc 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ffdcc2 0%, transparent 70%)', filter: 'blur(60px)' }}
          />

          <div className="relative max-w-4xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-up"
              style={{
                backgroundColor: 'rgba(251,171,188,0.20)',
                color: 'var(--primary)',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.04em',
                animationDelay: '0ms',
              }}
            >
              ✦ O Ateliê Digital da Sua Confeitaria
            </div>

            {/* Headline — editorial scale */}
            <h1
              className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up"
              style={{
                fontFamily: 'var(--font-jakarta)',
                color: 'var(--on-surface)',
                animationDelay: '80ms',
              }}
            >
              Transforme sua paixão{' '}
              <br />
              em{' '}
              <em
                className="not-italic"
                style={{ color: 'var(--primary)' }}
              >
                precisão.
              </em>
            </h1>

            <p
              className="text-lg lg:text-xl leading-relaxed max-w-lg mb-10 animate-fade-up"
              style={{
                fontFamily: 'var(--font-inter)',
                color: 'var(--on-surface-variant)',
                animationDelay: '160ms',
              }}
            >
              Onde a arte da confeitaria encontra a excelência da gestão profissional. 
              Pedidos e receitas em um só lugar.
            </p>

            <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="btn-primary h-12 px-8 text-base">
                    Criar meu Ateliê
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="btn-secondary h-12 px-8 text-base">
                    Já tenho conta
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="btn-primary h-12 px-8 text-base flex items-center gap-2">
                  Acessar Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Features — "No-Line" tonal shift */}
        <section style={{ backgroundColor: 'var(--surface-container-low)' }} className="px-6 lg:px-12 py-20">
          <div className="max-w-5xl mx-auto">
            {/* Section label */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}
            >
              Funcionalidades
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-14 tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
            >
              Tudo o que você precisa,{' '}
              <span style={{ color: 'var(--primary)' }}>sem o que não precisa.</span>
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: ClipboardList,
                  title: 'Pedidos',
                  desc: 'Gerencie encomendas do recebimento à entrega. Acompanhe status, prazos e clientes com clareza.',
                  accent: '#fbabbc',
                  iconColor: '#915160',
                },
                {
                  icon: BookOpen,
                  title: 'Fichas Técnicas',
                  desc: 'Organize receitas com ingredientes, rendimento e custo estimado. Precisão em cada fornada.',
                  accent: '#ffdcc2',
                  iconColor: '#795f4a',
                },
                {
                  icon: Package,
                  title: 'Estoque',
                  desc: 'Monitore insumos em tempo real com alertas visuais de nível baixo e crítico.',
                  accent: '#fceeb3',
                  iconColor: '#6e6436',
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="layer-card p-8 flex flex-col gap-5 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: feat.accent, opacity: 0.8 }}
                  >
                    <feat.icon className="w-6 h-6" style={{ color: feat.iconColor }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold mb-2 tracking-tight"
                      style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}
                    >
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-3"
        style={{ borderTop: '1px solid rgba(188,185,173,0.20)' }}
      >
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--on-surface-variant)', opacity: 0.7 }}>
          © 2026 Artisan Baker Pro. Todos os direitos reservados.
        </p>
        <div className="flex gap-5">
          {['Privacidade', 'Termos'].map(item => (
            <Link
              key={item}
              href="#"
              style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}
            >
              {item}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
