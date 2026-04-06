'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Package, AlertTriangle, ArrowUp, ArrowDown, Settings2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getEstoque } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { DonutProgress } from '../../../components/ui/DonutProgress'
import Link from 'next/link'

type StockLevel = 'normal' | 'low' | 'critical'

function calcLevel(qty: number, min: number): StockLevel {
  const pct = min > 0 ? qty / min : 1
  if (pct <= 0.5) return 'critical'
  if (pct <= 1.0) return 'low'
  return 'normal'
}

function calcPercent(qty: number, min: number): number {
  if (min <= 0) return 100
  return Math.min(Math.round((qty / (min * 2)) * 100), 100)
}

export default function EstoquePage() {
  const { getToken } = useAuth()
  const [estoque, setEstoque]        = useState<any[]>([])
  const [loading, setLoading]        = useState(true)
  const [searchTerm, setSearchTerm]  = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('todos')

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getEstoque(token)
          setEstoque(data)
        }
      } catch (e) {
        console.error('Erro ao carregar estoque:', e)
        // Sem mock — empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const filtered = estoque.filter(item => {
    const matchSearch = !searchTerm ||
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    if (levelFilter === 'todos') return matchSearch
    const lv = calcLevel(item.quantidade_atual ?? item.quantidade ?? 0, item.estoque_minimo ?? 0)
    return matchSearch && lv === levelFilter
  })

  // Contagens para os KPI cards
  const totalItems  = estoque.length
  const criticals   = estoque.filter(i => calcLevel(i.quantidade_atual ?? i.quantidade ?? 0, i.estoque_minimo ?? 0) === 'critical').length
  const lowItems    = estoque.filter(i => calcLevel(i.quantidade_atual ?? i.quantidade ?? 0, i.estoque_minimo ?? 0) === 'low').length

  const levelLabel: Record<string, string> = { todos: 'Todos', normal: 'Normal', low: 'Baixo', critical: 'Crítico' }
  const levelOptions = ['todos', 'normal', 'low', 'critical']

  return (
    <div className="space-y-10 animate-fade-in pb-20">

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            Insumos
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Controle de Estoque
          </h1>
        </div>
        <Link href="/estoque/novo" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Ingrediente
        </Link>
      </header>

      {/* KPI Cards — tonal layering */}
      {!loading && estoque.length > 0 && (
        <section className="grid grid-cols-3 gap-5">
          {[
            { label: 'Total de Itens',   value: totalItems, accent: 'rgba(251,171,188,0.20)', iconColor: '#915160', icon: Package },
            { label: 'Nível Baixo',      value: lowItems,   accent: 'rgba(255,220,194,0.30)', iconColor: '#795f4a', icon: AlertTriangle },
            { label: 'Estoque Crítico',  value: criticals,  accent: 'rgba(179,57,56,0.10)',   iconColor: '#b33938', icon: AlertTriangle },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="layer-card p-6 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: kpi.accent }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.iconColor }} />
              </div>
              <div>
                <p className="text-sm mb-0.5" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                  {kpi.value}
                </p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Search + Level Filters */}
      <section className="flex flex-col gap-4">
        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--outline-variant)' }} />
          <input
            type="text"
            placeholder="Pesquisar ingrediente ou categoria..."
            className="input-field pl-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {levelOptions.map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={levelFilter === l ? {
                background: 'linear-gradient(45deg, #915160, #834554)',
                color: '#fff',
                fontFamily: 'var(--font-jakarta)',
              } : {
                backgroundColor: 'var(--surface-container-high)',
                color: 'var(--on-surface-variant)',
                fontFamily: 'var(--font-jakarta)',
              }}
            >
              {levelLabel[l]}
            </button>
          ))}
        </div>
      </section>

      {/* Table / Empty */}
      {loading ? (
        <div className="layer-card overflow-hidden">
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: 'var(--surface-container-low)' }}>
            <Package className="w-9 h-9" style={{ color: 'var(--outline-variant)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            {searchTerm || levelFilter !== 'todos' ? 'Sem resultados' : 'Estoque vazio'}
          </h3>
          <p className="text-sm max-w-xs"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            {searchTerm ? 'Tente outra busca.' : 'Cadastre ingredientes para monitorar o estoque.'}
          </p>
          {(searchTerm || levelFilter !== 'todos') ? (
            <button onClick={() => { setSearchTerm(''); setLevelFilter('todos') }} className="btn-secondary mt-6">
              Limpar Filtros
            </button>
          ) : (
            <Link href="/estoque/novo" className="btn-primary mt-6">Novo Ingrediente</Link>
          )}
        </div>
      ) : (
        <div className="layer-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px_100px] items-center px-6 py-3"
            style={{ backgroundColor: 'var(--surface-container-low)' }}>
            {['Ingrediente', 'Categoria', 'Estoque Atual', 'Mínimo', 'Nível', 'Ações'].map(h => (
              <span key={h} className="text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows — sem dividers (Stitch No-Line rule) */}
          <div className="divide-y-0">
            {filtered.map((item, i) => {
              const qty  = item.quantidade_atual ?? item.quantidade ?? 0
              const min  = item.estoque_minimo ?? 0
              const lv   = calcLevel(qty, min)
              const pct  = calcPercent(qty, min)
              const unit = item.unidade_medida ?? item.unidade ?? ''

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_80px_100px] items-center px-6 py-4 transition-colors"
                  style={{ marginTop: i > 0 ? '1px' : 0, backgroundColor: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-container-low)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span className="font-semibold text-sm"
                    style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                    {item.nome}
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                    {item.categoria ?? '—'}
                  </span>

                  <span className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                    {qty} {unit}
                  </span>

                  <span className="text-sm"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                    {min} {unit}
                  </span>

                  <DonutProgress value={pct} level={lv} size={44} strokeWidth={4} />

                  <div className="flex items-center gap-1 justify-end">
                    <button
                      className="p-2 rounded-lg transition-colors"
                      title="Adicionar estoque"
                      style={{ color: 'var(--on-surface-variant)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,100,54,0.08)'; (e.currentTarget as HTMLElement).style.color = 'var(--tertiary)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)' }}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-2 rounded-lg transition-colors"
                      title="Baixar estoque"
                      style={{ color: 'var(--on-surface-variant)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(121,95,74,0.08)'; (e.currentTarget as HTMLElement).style.color = 'var(--secondary)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)' }}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/estoque/${item.id}`}
                      className="p-2 rounded-lg transition-colors"
                      title="Editar"
                      style={{ color: 'var(--on-surface-variant)' }}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
