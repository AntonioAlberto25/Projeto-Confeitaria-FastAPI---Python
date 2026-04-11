'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock, Users, BookOpen, ChevronDown, ChevronUp, Trash2, Edit3 } from 'lucide-react'
import { getReceita, deleteReceita } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DetalhesReceitaPage() {
  const { getToken } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [receita, setReceita] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const formatPrice = (value: any) => {
    if (value == null || value === '') return null
    const normalized = String(value)
      .trim()
      .replace(/[^0-9,.-]/g, '')
      .replace(',', '.')

    const numberValue = parseFloat(normalized)
    return Number.isFinite(numberValue) ? `R$ ${numberValue.toFixed(2)}` : null
  }

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token && id) {
          const data = await getReceita(token, id as string)
          setReceita(data)
        }
      } catch (e) {
        console.error('Erro ao carregar receita:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, id])

  const handleDelete = async () => {
    if (!confirm('Deseja excluir esta receita? Esta ação não pode ser desfeita.')) return
    try {
      const token = await getToken()
      if (token) {
        await deleteReceita(token, id as string)
        router.push('/receitas')
      }
    } catch (e) { console.error(e) }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-high)' }} />
        <div className="layer-card h-80 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
      </div>
    )
  }

  if (!receita) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: 'var(--surface-container-low)' }}>
          <BookOpen className="w-9 h-9" style={{ color: 'var(--outline-variant)' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Receita não encontrada
        </h2>
        <Link href="/receitas" className="btn-primary mt-4">Voltar para Receitas</Link>
      </div>
    )
  }

  const toggle = (key: string) => setExpanded(e => ({ ...e, [key]: !e[key] }))



  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-3xl">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/receitas" className="inline-flex items-center gap-2 text-sm"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
          <ArrowLeft className="w-4 h-4" /> Receitas Disponiveis
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/receitas/${id}/editar`}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ color: 'var(--error)', border: '1.5px solid rgba(179,57,56,0.20)', fontFamily: 'var(--font-jakarta)' }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Excluir
          </button>
        </div>
      </div>

      {/* Header card — receita "card" estilo editorial */}
      <div
        className="layer-card overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(251,171,188,0.15) 0%, rgba(255,220,194,0.10) 60%, rgba(252,238,179,0.08) 100%)' }}
      >
        <div className="p-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
            Ficha Técnica
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            {receita.nome}
          </h1>

          {receita.descricao && (
            <p className="text-sm leading-relaxed max-w-lg"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              {receita.descricao}
            </p>
          )}

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {receita.tempo_preparo && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(251,171,188,0.20)' }}>
                <Clock className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-inter)', color: 'var(--primary)' }}>
                  {receita.tempo_preparo} min
                </span>
              </div>
            )}
            {receita.rendimento && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(255,220,194,0.30)' }}>
                <Users className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-inter)', color: 'var(--secondary)' }}>
                  {receita.rendimento}
                </span>
              </div>
            )}
            {formatPrice(receita.preco_venda_sugerido) && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(252,238,179,0.40)' }}>
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--tertiary)' }}>
                  {formatPrice(receita.preco_venda_sugerido)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Modo de Preparo */}
      {receita.modo_preparo && (
        <div className="layer-card overflow-hidden">
          <button
            onClick={() => toggle('prep')}
            className="w-full flex items-center justify-between px-6 py-5"
          >
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              Modo de Preparo
            </h2>
            {expanded['prep'] ? (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--on-surface-variant)' }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--on-surface-variant)' }} />
            )}
          </button>
          {expanded['prep'] && (
            <div className="px-6 pb-6">
              <p className="text-sm leading-relaxed whitespace-pre-line"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                {receita.modo_preparo}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
