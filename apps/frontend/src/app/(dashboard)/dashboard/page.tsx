'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, ShoppingBasket, TrendingUp, Package, Plus, ClipboardList, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getPedidos, getReceitas } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { DonutProgress } from '../../../components/ui/DonutProgress'

export default function DashboardPage() {
  const { getToken } = useAuth()
  const [pedidos, setPedidos]   = useState<any[]>([])
  const [receitas, setReceitas] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token) {
          const [p, r] = await Promise.allSettled([getPedidos(token), getReceitas(token)])
          if (p.status === 'fulfilled') setPedidos(p.value)
          if (r.status === 'fulfilled') setReceitas(r.value)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const pendentes   = pedidos.filter(p => p.status === 'pendente').length
  const emProducao  = pedidos.filter(p => p.status === 'producao' || p.status === 'em_producao').length
  const totalHoje   = pedidos.length

  const kpis = [
    {
      label: 'Pedidos Hoje',
      value: totalHoje,
      icon: ClipboardList,
      accent: '#fbabbc',
      iconColor: '#915160',
      link: '/pedidos',
    },
    {
      label: 'Em Produção',
      value: emProducao,
      icon: ShoppingBasket,
      accent: '#fceeb3',
      iconColor: '#6e6436',
      link: '/pedidos',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      icon: AlertCircle,
      accent: '#ffdcc2',
      iconColor: '#795f4a',
      link: '/pedidos',
    },
    {
      label: 'Receitas',
      value: receitas.length,
      icon: Package,
      accent: 'rgba(188,185,173,0.25)',
      iconColor: '#66655a',
      link: '/receitas',
    },
  ]

  // Últimos 5 pedidos para o painel de produção
  const recentes = pedidos.slice(0, 5)

  return (
    <div className="space-y-10 animate-fade-in">

      {/* Header assimétrico — editorial */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}
          >
            Painel Principal
          </p>
          <h1
            className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
          >
            Dashboard de{' '}
            <span style={{ color: 'var(--primary)' }}>Produção</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/receitas" className="btn-secondary flex items-center gap-2">
            <Package className="w-4 h-4" /> Receitas
          </Link>
          <Link href="/pedidos/novo" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Pedido
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link href={kpi.link} className="block layer-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: kpi.accent }}
                >
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.iconColor }} />
                </div>
              </div>
              <p
                className="text-sm mb-1"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}
              >
                {kpi.label}
              </p>
              {loading ? (
                <div className="h-8 w-12 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-high)' }} />
              ) : (
                <p
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
                >
                  {kpi.value}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Painel de Produção — lista de pedidos recentes */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
            >
              Produção do Dia
            </h2>
            <Link
              href="/pedidos"
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}
            >
              Ver tudo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="layer-card overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
                ))}
              </div>
            ) : recentes.length === 0 ? (
              /* Empty state — sem dados, nada aparece */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--surface-container-low)' }}
                >
                  <ClipboardList className="w-7 h-7" style={{ color: 'var(--outline-variant)' }} />
                </div>
                <p className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                  Nenhum pedido encontrado
                </p>
                <Link href="/pedidos/novo" className="btn-primary mt-4 h-9 px-5 text-sm">
                  Criar primeiro pedido
                </Link>
              </div>
            ) : (
              /* Tabela — sem divisors ("No-Line" Stitch rule) */
              <div>
                <div
                  className="grid grid-cols-4 px-6 py-3"
                  style={{ backgroundColor: 'var(--surface-container-low)' }}
                >
                  {['Pedido', 'Cliente', 'Status', 'Entrega'].map(h => (
                    <span key={h} className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      {h}
                    </span>
                  ))}
                </div>
                {recentes.map((pedido) => (
                  <Link
                    key={pedido.id}
                    href={`/pedidos/${pedido.id}`}
                    className="grid grid-cols-4 px-6 py-4 transition-colors"
                    style={{ borderTop: '1px solid transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-container-low)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                      #{pedido.id}
                    </span>
                    <span className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      {pedido.cliente_nome}
                    </span>
                    <StatusBadge status={pedido.status} />
                    <span className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                      {pedido.data_entrega ? new Date(pedido.data_entrega).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar direita — Métricas de Estoque */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
            >
              Visão do Estoque
            </h2>
            <Link
              href="/estoque"
              className="text-sm font-medium"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}
            >
              Gerenciar
            </Link>
          </div>

          <div className="layer-card p-6 flex flex-col gap-6">
            {/* Doughnut Rings — Signature Component */}
            <div className="grid grid-cols-3 gap-4">
              <DonutProgress value={78} level="normal" label="Farinha" sublabel="7,8 kg" />
              <DonutProgress value={32} level="low"    label="Manteiga" sublabel="3,2 kg" />
              <DonutProgress value={12} level="critical" label="Açúcar" sublabel="1,2 kg" />
            </div>

            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'var(--surface-container-low)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                Alertas
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Açúcar refinado', level: 'Crítico', color: 'var(--error)' },
                  { label: 'Manteiga extra', level: 'Baixo',   color: 'var(--secondary)' },
                ].map((alert) => (
                  <div key={alert.label} className="flex items-center justify-between">
                    <span className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                      {alert.label}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: alert.color }}>
                      {alert.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/estoque" className="btn-secondary w-full text-center text-sm h-10">
              Ver estoque completo
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
