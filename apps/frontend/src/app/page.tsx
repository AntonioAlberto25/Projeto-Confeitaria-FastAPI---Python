import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { ChefHat, ArrowRight, Star, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center glass fixed top-0 w-full z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-manrope font-bold text-lg text-primary tracking-tight">Artisan Baker Pro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <SignedIn>
            <Link href="/dashboard" className="btn-primary flex items-center justify-center">
              Ir para o Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:text-primary transition-colors">Entrar</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">Começar agora</button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-manrope font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary max-w-3xl leading-tight">
                  Transforme sua paixão em <span className="text-secondary italic">precisão</span>.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl font-jakarta mt-4">
                  Onde a arte da confeitaria encontra a excelência da gestão profissional. Controle pedidos, receitas e estoque em um só lugar.
                </p>
              </div>
              <div className="space-x-4 pt-8">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="btn-primary h-12 px-8 text-lg">Criar meu Atelier</button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="btn-primary h-12 px-8 text-lg flex items-center gap-2">
                    Acessar Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-surface-container-low">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 layer-card">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-manrope font-bold uppercase tracking-wider text-secondary">Excelência Artesanal</h3>
                <p className="text-sm text-gray-500 font-jakarta">Fichas técnicas precisas para manter o padrão de qualidade de cada fornada.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 layer-card">
                <div className="p-3 bg-tertiary/10 rounded-full">
                  <Clock className="h-6 w-6 text-tertiary" />
                </div>
                <h3 className="text-xl font-manrope font-bold uppercase tracking-wider text-secondary">Gestão de Tempo</h3>
                <p className="text-sm text-gray-500 font-jakarta">Visualize sua linha de produção e priorize pedidos por data de entrega.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 layer-card">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-manrope font-bold uppercase tracking-wider text-secondary">Controle de Estoque</h3>
                <p className="text-sm text-gray-500 font-jakarta">Monitore seus insumos em tempo real e evite surpresas na produção.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-surface border-t border-surface-container-highest/20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary/60">
            © 2026 Artisan Baker Pro. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link className="text-xs hover:text-primary transition-colors" href="#">Privacidade</Link>
            <Link className="text-xs hover:text-primary transition-colors" href="#">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
