'use client'

import React, { useState } from 'react'
import { User, Shield, Database, Palette, Save, Check } from 'lucide-react'
import { useTheme } from '../../../components/ThemeProvider'

type TabKey = 'perfil' | 'seguranca' | 'dados' | 'aparencia'

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'perfil', label: 'Perfil', icon: User },
  { key: 'seguranca', label: 'Segurança', icon: Shield },
  { key: 'dados', label: 'Dados', icon: Database },
  { key: 'aparencia', label: 'Aparência', icon: Palette },
]

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('perfil')
  const [saved, setSaved] = useState(false)

  // Form state
  const [perfil, setPerfil] = useState({
    nomeUnidade: 'Artisan Baker - Jardins',
    responsavel: '',
    telefone: '',
    email: '',
  })



  const { theme: currentTheme, setTheme } = useTheme()

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = "w-full h-12 px-4 rounded-xl text-sm transition-all duration-200 input-field"
  const labelClass = "block text-xs font-semibold uppercase tracking-widest mb-2"

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}>
            Configurações
          </h1>
          <p className="text-sm"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            Personalize sua experiência e gerencie preferências
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3 w-full md:w-auto"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(251,171,188,0.15) 0%, rgba(255,220,194,0.10) 100%)',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-jakarta)',
                } : {
                  color: 'var(--on-surface-variant)',
                  fontFamily: 'var(--font-jakarta)',
                }}
              >
                <Icon className="w-4 h-4" style={{ opacity: isActive ? 1 : 0.6 }} />
                {tab.label}
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <section className="lg:col-span-3">
          {/* ── Perfil ── */}
          {activeTab === 'perfil' && (
            <div className="layer-card p-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                  Informações da Unidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      Nome da Unidade
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={perfil.nomeUnidade}
                      onChange={e => setPerfil(p => ({ ...p, nomeUnidade: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      Responsável Técnico
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do responsável"
                      className={inputClass}
                      value={perfil.responsavel}
                      onChange={e => setPerfil(p => ({ ...p, responsavel: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                      value={perfil.telefone}
                      onChange={e => setPerfil(p => ({ ...p, telefone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}
                      style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      E-mail de Contato
                    </label>
                    <input
                      type="email"
                      placeholder="contato@suaconfeitaria.com"
                      className={inputClass}
                      value={perfil.email}
                      onChange={e => setPerfil(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Segurança ── */}
          {activeTab === 'seguranca' && (
            <div className="layer-card p-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                  Segurança da Conta
                </h3>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-inter)' }}>
                  As configurações de segurança como senha, autenticação de dois fatores e dispositivos conectados são gerenciadas pelo seu provedor de autenticação.
                </p>
                <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--surface-container-low)' }}>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                        Gerenciado pelo Clerk
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-inter)' }}>
                        Para alterar sua senha, ativar 2FA ou gerenciar sessões, acesse seu perfil clicando no avatar na barra lateral.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* ── Dados ── */}
          {activeTab === 'dados' && (
            <div className="layer-card p-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                  Gerenciamento de Dados
                </h3>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--surface-container-low)' }}>
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                          Exportar Dados
                        </p>
                        <p className="text-xs mt-1 mb-3" style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-inter)' }}>
                          Faça o download de todos os seus pedidos e receitas em formato CSV.
                        </p>
                        <button className="btn-secondary text-xs px-4 py-2">
                          Exportar CSV
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl" style={{ backgroundColor: 'rgba(179,57,56,0.04)' }}>
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--error)' }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--error)' }}>
                          Zona de Perigo
                        </p>
                        <p className="text-xs mt-1 mb-3" style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-inter)' }}>
                          A exclusão de dados é irreversível. Todos os pedidos e receitas serão permanentemente removidos.
                        </p>
                        <button
                          className="text-xs px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                          style={{
                            backgroundColor: 'rgba(179,57,56,0.08)',
                            color: 'var(--error)',
                            fontFamily: 'var(--font-jakarta)',
                            border: '1px solid rgba(179,57,56,0.2)',
                          }}
                        >
                          Excluir Todos os Dados
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Aparência ── */}
          {activeTab === 'aparencia' && (
            <div className="layer-card p-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                  Aparência
                </h3>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-inter)' }}>
                  Escolha o tema visual da aplicação.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {([
                    { key: 'claro' as const, label: 'Claro', emoji: '☀️' },
                    { key: 'escuro' as const, label: 'Escuro', emoji: '🌙' },
                    { key: 'sistema' as const, label: 'Sistema', emoji: '💻' },
                  ]).map((tema) => (
                    <button
                      key={tema.key}
                      onClick={() => setTheme(tema.key)}
                      className="flex flex-col items-center gap-2 p-5 rounded-xl transition-all duration-200"
                      style={currentTheme === tema.key ? {
                        background: 'linear-gradient(135deg, rgba(251,171,188,0.15) 0%, rgba(255,220,194,0.10) 100%)',
                        border: '2px solid var(--primary)',
                        color: 'var(--primary)',
                      } : {
                        backgroundColor: 'var(--surface-container-low)',
                        border: '2px solid transparent',
                        color: 'var(--on-surface-variant)',
                      }}
                    >
                      <span className="text-2xl">{tema.emoji}</span>
                      <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-jakarta)' }}>
                        {tema.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
