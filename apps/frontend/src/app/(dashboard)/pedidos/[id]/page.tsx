'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit3, CheckCircle2, Play, XCircle, Calendar, MapPin, ClipboardList } from 'lucide-react'
import { getPedido, deletePedido } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from '../../../../components/ui/StatusBadge'
import Link from 'next/link'

export default function DetalhesPedidoPage() {
  const { getToken } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [pedido, setPedido]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token && id) {
          const data = await getPedido(token, Number(id))
          setPedido(data)
        }
      } catch (e) {
        console.error('Erro ao carregar pedido:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, id])

  const handleDelete = async () => {
    if (!confirm('Deseja realmente cancelar este pedido? Esta ação não pode ser desfeita.')) return
    try {
      const token = await getToken()
      if (token) {
        await deletePedido(token, Number(id))
        router.push('/pedidos')
      }
    } catch (e) {
      console.error('Erro ao cancelar pedido:', e)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-high)' }} />
        <div className="layer-card h-64 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: 'var(--surface-container-low)' }}>
          <ClipboardList className="w-9 h-9" style={{ color: 'var(--outline-variant)' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Pedido não encontrado
        </h2>
        <Link href="/pedidos" className="btn-primary mt-4">Voltar para Pedidos</Link>
      </div>
    )
  }

  const accentColor = pedido.status === 'pendente' ? 'var(--surface-container-highest)' :
    pedido.status === 'concluido' ? '#e2ead1' :
    pedido.status === 'cancelado' ? 'rgba(179,57,56,0.12)' : '#fceeb3'

  return (
    <div className="space-y-8 animate-fade-in pb-20">

      {/* Back link */}
      <Link href="/pedidos" className="inline-flex items-center gap-2 text-sm transition-colors"
        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Voltar para Pedidos
      </Link>

      {/* Header card */}
      <div className="layer-card overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />
        <div className="p-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
              Pedido #{pedido.id}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              {pedido.cliente_nome}
            </h1>
            <StatusBadge status={pedido.status} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {pedido.status === 'pendente' && (
              <button className="btn-primary flex items-center gap-2">
                <Play className="w-4 h-4" /> Iniciar Produção
              </button>
            )}
            {(pedido.status === 'producao' || pedido.status === 'em_producao') && (
              <button className="btn-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Marcar Concluído
              </button>
            )}
            <Link href={`/pedidos/${id}/editar`} className="btn-secondary flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Editar
            </Link>
            {pedido.status !== 'cancelado' && pedido.status !== 'concluido' && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--error)', border: '1.5px solid rgba(179,57,56,0.25)' }}
              >
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Informações do pedido */}
          <div className="layer-card p-6 space-y-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              Informações do Pedido
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {pedido.data_entrega && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                    Data de Entrega
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                      {new Date(pedido.data_entrega).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              )}
              {pedido.tipo_entrega && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                    Tipo de Entrega
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                      {pedido.tipo_entrega}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {pedido.descricao && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                  Descrição
                </p>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                  {pedido.descricao}
                </p>
              </div>
            )}

            {pedido.observacoes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                  Observações
                </p>
                <p className="text-sm leading-relaxed italic"
                  style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                  {pedido.observacoes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="space-y-5">
          {pedido.preco_total != null && (
            <div className="layer-card p-6" style={{ background: 'linear-gradient(135deg, rgba(251,171,188,0.10) 0%, rgba(255,220,194,0.08) 100%)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                Total do Pedido
              </p>
              <p className="text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}>
                R$ {Number(pedido.preco_total).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
