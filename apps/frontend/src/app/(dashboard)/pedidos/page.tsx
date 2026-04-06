'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, ShoppingBasket, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPedidos } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import Link from 'next/link'

export default function PedidosPage() {
  const { getToken } = useAuth()
  const [pedidos, setPedidos]       = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getPedidos(token)
          setPedidos(data)
        }
      } catch (e) {
        console.error('Erro ao carregar pedidos:', e)
        // Sem mock data — empty state apresentado
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const statusOptions = ['todos', 'pendente', 'producao', 'concluido', 'cancelado']
  const statusLabel: Record<string, string> = {
    todos: 'Todos', pendente: 'Pendente', producao: 'Em Produção',
    concluido: 'Concluído', cancelado: 'Cancelado',
  }

  const filtered = pedidos.filter(p => {
    const matchSearch = !searchTerm ||
      p.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id).includes(searchTerm)
    const matchStatus = statusFilter === 'todos' ||
      p.status === statusFilter ||
      (statusFilter === 'producao' && p.status === 'em_producao')
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-10 animate-fade-in pb-20">

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
            Gestão
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Pedidos
          </h1>
        </div>
        <Link href="/pedidos/novo" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Pedido
        </Link>
      </header>

      {/* Search + Status Filters */}
      <section className="flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
            style={{ color: 'var(--outline-variant)' }} />
          <input
            type="text"
            placeholder="Pesquisar por cliente, item ou número do pedido..."
            className="input-field pl-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={statusFilter === s ? {
                background: 'linear-gradient(45deg, #915160, #834554)',
                color: '#fff',
                fontFamily: 'var(--font-jakarta)',
              } : {
                backgroundColor: 'var(--surface-container-high)',
                color: 'var(--on-surface-variant)',
                fontFamily: 'var(--font-jakarta)',
              }}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>
      </section>

      {/* Cards Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="layer-card h-52 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <ShoppingBasket className="w-9 h-9" style={{ color: 'var(--outline-variant)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              {searchTerm || statusFilter !== 'todos' ? 'Nenhum pedido encontrado' : 'Nenhum pedido ainda'}
            </h3>
            <p className="text-sm max-w-xs" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              {searchTerm ? 'Tente outra busca ou limpe o filtro.' : 'Crie seu primeiro pedido para começar.'}
            </p>
            {(searchTerm || statusFilter !== 'todos') ? (
              <button onClick={() => { setSearchTerm(''); setStatusFilter('todos') }} className="btn-secondary mt-6">
                Limpar Filtros
              </button>
            ) : (
              <Link href="/pedidos/novo" className="btn-primary mt-6">Criar Pedido</Link>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((pedido, i) => (
                <motion.div
                  key={pedido.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Link
                    href={`/pedidos/${pedido.id}`}
                    className="block layer-card group hover:scale-[1.015] transition-all duration-300 overflow-hidden"
                  >
                    {/* Tonal accent top bar by status */}
                    <div className="h-0.5 w-full" style={{
                      background: pedido.status === 'pendente' ? 'var(--surface-container-highest)' :
                        pedido.status === 'concluido' ? '#e2ead1' :
                        pedido.status === 'cancelado' ? 'var(--error)' :
                        '#fceeb3'
                    }} />

                    <div className="p-6 space-y-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                            Pedido #{pedido.id}
                          </p>
                          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors"
                            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                            {pedido.cliente_nome}
                          </h3>
                        </div>
                        <StatusBadge status={pedido.status} />
                      </div>

                      {pedido.descricao && (
                        <p className="text-sm line-clamp-2"
                          style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                          {pedido.descricao}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2"
                        style={{ borderTop: '1px solid rgba(188,185,173,0.15)' }}>
                        <div className="flex gap-4">
                          {pedido.data_entrega && (
                            <div className="flex items-center gap-1.5 text-xs"
                              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(pedido.data_entrega).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {pedido.tipo_entrega && (
                            <div className="flex items-center gap-1.5 text-xs"
                              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                              <MapPin className="w-3.5 h-3.5" />
                              {pedido.tipo_entrega}
                            </div>
                          )}
                        </div>
                        {pedido.preco_total != null && (
                          <span className="text-lg font-bold"
                            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}>
                            R$ {Number(pedido.preco_total).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
