'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, BookOpen, Clock, ChevronRight, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getReceitas } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ReceitasPage() {
  const { getToken } = useAuth()
  const [receitas, setReceitas] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getReceitas(token)
          setReceitas(data)
        }
      } catch (e) {
        console.error('Erro ao carregar receitas:', e)
        // Sem mock — empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const filtered = receitas.filter(r =>
    !searchTerm ||
    r.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const router = useRouter()

  const formatPrice = (value: any) => {
    if (value == null || value === '') return null
    const normalized = String(value)
      .trim()
      .replace(/[^0-9,.-]/g, '')
      .replace(',', '.')

    const numberValue = parseFloat(normalized)
    return Number.isFinite(numberValue) ? `R$ ${numberValue.toFixed(2)}` : null
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            Fichas Técnicas
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Receitas Disponiveis
          </h1>
        </div>
        <Link href="/receitas/nova" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Receita
        </Link>
      </header>

      {/* Search */}
      <section className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--outline-variant)' }} />
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          className="input-field pl-12"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="layer-card h-48 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: 'var(--surface-container-low)' }}>
            <BookOpen className="w-9 h-9" style={{ color: 'var(--outline-variant)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            {searchTerm ? 'Nenhuma receita encontrada' : 'Nenhuma receita ainda'}
          </h3>
          <p className="text-sm max-w-xs"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            {searchTerm ? 'Tente outra busca.' : 'Crie sua primeira receita com ficha técnica completa.'}
          </p>
          {searchTerm ? (
            <button onClick={() => setSearchTerm('')} className="btn-secondary mt-6">Limpar busca</button>
          ) : (
            <Link href="/receitas/nova" className="btn-primary mt-6">Criar Receita</Link>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((receita, i) => (
              <motion.div
                key={receita.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <div className="relative">
                  <Link
                    href={`/receitas/${receita.id}`}
                    className="block layer-card group hover:scale-[1.015] transition-all duration-300 overflow-hidden"
                  >
                    {/* Header card — gradiente de primary-container */}
                    <div
                      className="h-20 relative flex items-end px-6 pb-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251,171,188,0.25) 0%, rgba(255,220,194,0.15) 100%)',
                      }}
                    >
                      <div
                        className="absolute top-4 left-6 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(251,171,188,0.4)' }}
                      >
                        <BookOpen className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors"
                        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                        {receita.nome}
                      </h3>
                      {receita.descricao && (
                        <p className="text-sm line-clamp-2"
                          style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                          {receita.descricao}
                        </p>
                      )}
                    </div>

                    {/* Metadata row */}
                    <div className="flex items-center gap-6">
                      {receita.tempo_preparo && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-semibold tracking-widest"
                            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                            Tempo
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--primary)', opacity: 0.7 }} />
                            <span className="text-xs font-medium"
                              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                              {receita.tempo_preparo} min
                            </span>
                          </div>
                        </div>
                      )}
                      {receita.rendimento && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-semibold tracking-widest"
                            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                            Rendimento
                          </span>
                          <span className="text-xs font-medium"
                            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                            {receita.rendimento}
                          </span>
                        </div>
                      )}
                      {formatPrice(receita.preco_venda_sugerido) && (
                        <div className="flex flex-col gap-0.5 ml-auto text-right">
                          <span className="text-[10px] uppercase font-semibold tracking-widest"
                            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                            Preço
                          </span>
                          <span className="text-sm font-bold"
                            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}>
                            {formatPrice(receita.preco_venda_sugerido)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA subliminar */}
                    <div className="flex items-center justify-end pt-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ backgroundColor: 'var(--surface-container-low)' }}
                      >
                        <ChevronRight className="w-4 h-4" style={{ color: 'var(--on-surface-variant)' }} />
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/receitas/${receita.id}/editar`)
                  }}
                  className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>
              </div>
            </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
