'use client'

import React from 'react'
import { Flame, Clock, TrendingUp, AlertCircle, ShoppingBasket, Plus, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    { label: 'Capacidade', value: '85%', color: 'text-primary', bg: 'bg-primary/10', icon: Flame },
    { label: 'Meta de Produção', value: '72%', color: 'text-tertiary', bg: 'bg-tertiary/10', icon: TrendingUp },
    { label: 'Pedidos Pendentes', value: '12', color: 'text-secondary', bg: 'bg-secondary/10', icon: Clock },
    { label: 'Ingredientes em Alerta', value: '3', color: 'text-error', bg: 'bg-error/10', icon: AlertCircle },
  ]

  const producaoDia = [
    { status: 'concluido', time: '08:30', client: 'Bolo de Morango', order: '#4521', amount: '2 un' },
    { status: 'producao', time: '10:00', client: 'Brioches Franceses', order: '#4522', amount: '24 un' },
    { status: 'pendente', time: '13:00', client: 'Torta de Nozes', order: '#4523', amount: '1 un' },
    { status: 'pendente', time: '15:30', client: 'Macarons Sortidos', order: '#4524', amount: '48 un' },
  ]

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Dashboard de Produção</h1>
          <p className="text-secondary font-jakarta text-sm flex items-center gap-2">
            Unidade Jardins <span className="w-1 h-1 bg-secondary/30 rounded-full italic" /> Hoje, 01 de Abril
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/pedidos" className="btn-secondary flex items-center justify-center gap-2 p-3">
            <ShoppingBasket className="w-4 h-4" /> Ver Pedidos
          </Link>
          <button className="btn-primary flex items-center justify-center gap-2 p-3">
            <Plus className="w-4 h-4" /> Novo Pedido
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="layer-card p-6 flex flex-col gap-4 group hover:scale-[1.02] cursor-default transition-all duration-300 active:scale-95"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-secondary/40 font-manrope uppercase tracking-widest">+3 desde 08h</span>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary/60 mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-manrope font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className={`h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden`}>
              <div 
                className={`h-full transition-all duration-1000 ease-out delay-500`}
                style={{ 
                  width: stat.value, 
                  background: `currentColor`,
                  color: stat.color.replace('text-', '') === 'primary' ? '#874c3c' : (stat.color.replace('text-', '') === 'tertiary' ? '#21665c' : '#5d5e5f')
                }}
              />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produção do Dia */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-manrope font-bold text-primary">Produção do Dia</h2>
            <Link href="/producao" className="text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center justify-center">Ver tudo</Link>
          </div>
          
          <div className="layer-card overflow-hidden">
            <table className="w-full text-left font-jakarta text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 font-bold text-secondary/80">Item</th>
                  <th className="px-6 py-4 font-bold text-secondary/80">Quantidade</th>
                  <th className="px-6 py-4 font-bold text-secondary/80">Horário</th>
                  <th className="px-6 py-4 font-bold text-secondary/80 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {producaoDia.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-6 py-4 flex flex-col items-start gap-1">
                      <span className="font-bold text-secondary">{item.client}</span>
                      <span className="text-xs text-secondary/50">{item.order}</span>
                    </td>
                    <td className="px-6 py-4 text-secondary/80">{item.amount}</td>
                    <td className="px-6 py-4 text-secondary/80 font-medium">{item.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`badge badge-${item.status}`}>
                        {item.status === 'concluido' ? 'Concluído' : (item.status === 'producao' ? 'Em Produção' : 'Pendente')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dica de Produção */}
        <section className="space-y-6">
          <h2 className="text-xl font-manrope font-bold text-primary">Dica de Produção</h2>
          <div className="layer-card p-8 bg-gradient-to-br from-primary/10 to-surface-container flex flex-col gap-6 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 cursor-default">
            <div className="p-3 bg-white rounded-xl shadow-sm self-start group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <p className="text-secondary/80 italic font-jakarta leading-relaxed text-lg">
              "O forno 02 está operando 5°C acima da média. Ajuste o tempo de queima para os brioches em -3 minutos."
            </p>
            <div className="absolute -right-10 -bottom-10 opacity-10 blur-2xl flex items-center justify-center">
              <ChefHat className="w-64 h-64 text-primary" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
