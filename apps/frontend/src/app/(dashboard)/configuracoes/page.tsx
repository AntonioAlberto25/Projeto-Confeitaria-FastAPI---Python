'use client'

import React from 'react'
import { User, Shield, Bell, Database, Palette, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Configurações</h1>
          <p className="text-secondary font-jakarta text-sm">Personalize sua experiência e gerencie preferências</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 p-3 w-full md:w-auto shadow-lg shadow-primary/20">
          <Save className="w-4 h-4" /> Salvar Alterações
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Mini */}
        <aside className="lg:col-span-1 space-y-2">
          {[
            { label: 'Perfil', icon: User, active: true },
            { label: 'Segurança', icon: Shield, active: false },
            { label: 'Notificações', icon: Bell, active: false },
            { label: 'Dados', icon: Database, active: false },
            { label: 'Aparência', icon: Palette, active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${item.active ? 'bg-primary/5 text-primary' : 'text-secondary/60 hover:bg-secondary/5 hover:text-secondary'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <section className="lg:col-span-3 space-y-8">
          <div className="layer-card p-8 space-y-8">
             <div className="space-y-4">
                <h3 className="text-lg font-bold text-secondary font-manrope">Informações da Unidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary/40 uppercase tracking-widest">Nome da Unidade</label>
                      <input type="text" defaultValue="Artisan Baker - Jardins" className="w-full h-12 px-4 bg-surface-container-highest/20 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 transition-all font-jakarta text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary/40 uppercase tracking-widest">Responsável Técnico</label>
                      <input type="text" defaultValue="Antônio Alberto" className="w-full h-12 px-4 bg-surface-container-highest/20 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 transition-all font-jakarta text-sm" />
                   </div>
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t border-surface-container-highest/10">
                <h3 className="text-lg font-bold text-secondary font-manrope">Preferências de Alerta</h3>
                <div className="space-y-4">
                   {[
                     'Notificar quando ingrediente atingir estoque crítico',
                     'Enviar resumo de pedidos do dia por e-mail',
                     'Habilitar som para novos pedidos pendentes',
                   ].map((pref, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-lg group">
                        <span className="text-sm text-secondary/80 font-jakarta">{pref}</span>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                           <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  )
}
