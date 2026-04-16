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
  const totalHoje   = pedidos.filter(p => p.status !== 'cancelado' && p.status !== 'concluido').length

  const kpis = [
    {
      label: 'Pedidos Hoje',
      value: totalHoje,
      icon: ClipboardList,
      accent: '#fbabbc',
      iconColor: '#915160',
      link: '/pedidos?status=todos',
    },
    {
      label: 'Em Produção',
      value: emProducao,
      icon: ShoppingBasket,
      accent: '#fceeb3',
      iconColor: '#6e6436',
      link: '/pedidos?status=em_producao',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      icon: AlertCircle,
      accent: '#ffdcc2',
      iconColor: '#795f4a',
      link: '/pedidos?status=pendente',
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

  // Últimos 10 pedidos ativos para o painel de produção
  const recentes = pedidos
    .filter(p => p.status !== 'cancelado' && p.status !== 'concluido')
    .slice(0, 10)

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
                  className="grid px-6 py-3"
                  style={{ gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr', backgroundColor: 'var(--surface-container-low)' }}
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
                    className="grid items-center px-6 py-4 transition-colors"
                    style={{ gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr', borderTop: '1px solid transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-container-low)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                      #{String(pedido.id).slice(0, 8)}
                    </span>
                    <span className="text-sm truncate pr-2" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
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

        {/* Sidebar direita — Receitas Recentes */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}
            >
              Receitas Recentes
            </h2>
            <Link
              href="/receitas"
              className="text-sm font-medium"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}
            >
              Ver todas
            </Link>
          </div>

          <div className="layer-card p-6 flex flex-col gap-6">
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
                ))
              ) : receitas.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                  Nenhuma receita encontrada
                </p>
              ) : (
                receitas.slice(0, 4).map((receita) => (
                  <Link 
                    key={receita.id} 
                    href={`/receitas`}
                    className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-[var(--surface-container-low)]"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                      🍰
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                        {receita.nome}
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                        {receita.preco_venda_sugerido ? `R$ ${Number(receita.preco_venda_sugerido).toFixed(2)}` : 'Preço não definido'}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link href="/pedidos/novo" className="btn-primary w-full text-center text-sm h-10 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Novo Pedido
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
