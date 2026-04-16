'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit3, CheckCircle2, Play, XCircle, Calendar, MapPin, ClipboardList, AlertTriangle, ChevronDown, ChevronUp, ChefHat, Clock, Users } from 'lucide-react'
import { getPedido, updatePedido, deletePedido, getReceita } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from '../../../../components/ui/StatusBadge'
import Link from 'next/link'

export default function DetalhesPedidoPage() {
  const { getToken } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState<any>(null)
  const [receita, setReceita] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token && id) {
          const data = await getPedido(token, id as string)
          setPedido(data)

          if (data.receita_id) {
            try {
              const recData = await getReceita(token, data.receita_id)
              setReceita(recData)
            } catch (err) {
              console.error('Erro ao carregar receita vinculada:', err)
            }
          }
        }
      } catch (e) {
        console.error('Erro ao carregar pedido:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, id])

  const toggle = (key: string) => setExpanded(e => ({ ...e, [key]: !e[key] }))

  const handleDelete = async () => {
    try {
      const token = await getToken()
      if (token) {
        await deletePedido(token, id as string)
        router.push('/pedidos')
      }
    } catch (e) {
      console.error('Erro ao excluir pedido:', e)
    } finally {
      setShowConfirm(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = await getToken()
      if (token && id) {
        let updateData: any = { ...pedido, status: newStatus }

        if (newStatus === 'em_producao') {
          updateData.data_inicio_producao = new Date().toISOString()
        } else if (newStatus === 'concluido') {
          updateData.data_conclusao = new Date().toISOString()
        }

        const data = await updatePedido(token, id as string, updateData)
        setPedido(data)
      }
    } catch (e) {
      console.error('Erro ao atualizar status:', e)
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
    <>
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
              Pedido #{String(pedido.id).slice(0, 8)}
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
              <button
                onClick={() => handleStatusChange('em_producao')}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Iniciar Produção
              </button>
            )}
            {(pedido.status === 'producao' || pedido.status === 'em_producao') && (
              <button
                onClick={() => handleStatusChange('concluido')}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Marcar Concluído
              </button>
            )}
            {pedido.status !== 'cancelado' && pedido.status !== 'concluido' && (
              <Link href={`/pedidos/${id}/editar`} className="btn-secondary flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Editar
              </Link>
            )}
            {pedido.status !== 'cancelado' && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--error)', border: '1.5px solid rgba(179,57,56,0.25)' }}
              >
                <XCircle className="w-4 h-4" /> {pedido.status === 'concluido' ? 'Excluir' : 'Cancelar'}
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
                      {pedido.status !== 'concluido' && pedido.status !== 'cancelado' && new Date(pedido.data_entrega) < new Date(new Date().setHours(0, 0, 0, 0)) && (
                        <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(179,57,56,0.1)', color: 'var(--error)' }}>
                          Atrasado
                        </span>
                      )}
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
              {pedido.tipo_entrega === 'Entrega' && pedido.endereco_entrega && (
                <div className="col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                    Endereço de Entrega
                  </p>
                  <p className="text-sm font-medium whitespace-pre-line" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                    {pedido.endereco_entrega}
                  </p>
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

          {/* Histórico do Pedido */}
          <div className="layer-card p-6 space-y-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              Histórico do Pedido
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 text-sm justify-between pb-3 border-b border-[var(--surface-container-high)]">
                <span className="font-semibold" style={{ color: 'var(--on-surface-variant)' }}>Criado em</span>
                <span style={{ color: 'var(--on-surface)' }}>
                  {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleString('pt-BR') : 'Data não disponível'}
                </span>
              </div>

              {pedido.data_inicio_producao && (
                <div className="flex flex-col sm:flex-row gap-2 text-sm justify-between pb-3 border-b border-[var(--surface-container-high)]">
                  <span className="font-semibold" style={{ color: 'var(--on-surface-variant)' }}>Produção iniciada em</span>
                  <span style={{ color: 'var(--on-surface)' }}>
                    {new Date(pedido.data_inicio_producao).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}

              {pedido.data_conclusao && (
                <div className="flex flex-col sm:flex-row gap-2 text-sm justify-between pb-3 border-b border-[var(--surface-container-high)]">
                  <span className="font-semibold" style={{ color: 'var(--on-surface-variant)' }}>Concluído em</span>
                  <span style={{ color: 'var(--on-surface)' }}>
                    {new Date(pedido.data_conclusao).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Receita Vinculada (Modo de Preparo) */}
          {receita && receita.modo_preparo && (
            <div className="layer-card overflow-hidden">
              <button
                onClick={() => toggle('prep')}
                className="w-full flex items-center justify-between px-6 py-5 gap-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                    <ChefHat className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                      Receita: {receita.nome}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      Modo de Preparo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <div className="hidden sm:flex flex-wrap items-center gap-2 mr-2">
                    {receita.tempo_preparo && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(251,171,188,0.20)' }}>
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        <span className="text-[11px] font-semibold whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)', color: 'var(--primary)' }}>
                          {receita.tempo_preparo} min
                        </span>
                      </div>
                    )}
                    {receita.rendimento && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(255,220,194,0.30)' }}>
                        <Users className="w-3.5 h-3.5" style={{ color: 'var(--secondary)' }} />
                        <span className="text-[11px] font-semibold whitespace-nowrap" style={{ fontFamily: 'var(--font-inter)', color: 'var(--secondary)' }}>
                          {receita.rendimento}
                        </span>
                      </div>
                    )}
                  </div>
                  {expanded['prep'] ? (
                    <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--on-surface-variant)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--on-surface-variant)' }} />
                  )}
                </div>
              </button>
              {expanded['prep'] && (
                <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: 'var(--surface-container-high)' }}>
                  <p className="text-sm leading-relaxed whitespace-pre-line mt-4"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                    {receita.modo_preparo}
                  </p>
                </div>
              )}
            </div>
          )}
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
                R$ {pedido.preco_total ? Number(pedido.preco_total).toFixed(2) : '0.00'}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="layer-card p-8 max-w-md w-full mx-4 space-y-6"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>

            {/* Ícone */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(179,57,56,0.10)' }}>
                <AlertTriangle className="w-8 h-8" style={{ color: 'var(--error)' }} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                {pedido.status === 'concluido' ? 'Excluir Pedido' : 'Cancelar Pedido'}
              </h3>
              <p className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                Deseja realmente {pedido.status === 'concluido' ? 'excluir' : 'cancelar'} este pedido? Esta ação vai <strong>exclui-lo de forma permanente</strong> do sistema!
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  backgroundColor: 'var(--surface-container-high)',
                  color: 'var(--on-surface-variant)',
                }}
              >
                Voltar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  background: 'linear-gradient(45deg, #b33938, #a03030)',
                  color: '#fff',
                }}
              >
                {pedido.status === 'concluido' ? 'Sim, Excluir' : 'Sim, Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
