'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, ShoppingBasket, Calendar, MapPin, ArrowRight, Trash2, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPedidos, deletePedido } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PedidosPage() {
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const [pedidos, setPedidos]       = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'todos')
  const [pedidoToDelete, setPedidoToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [total, setTotal] = useState(0)
  const [allCounts, setAllCounts] = useState<Record<string, number>>({
    todos: 0,
    pendente: 0,
    em_producao: 0,
    concluido: 0
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, limit])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const token = await getToken()
        if (token) {
          const skip = (page - 1) * limit
          const data = await getPedidos(token, limit, skip, statusFilter === 'todos' ? 'ativos' : statusFilter, debouncedSearch)
          setPedidos(data.items ? data.items : data)
          setTotal(data.total !== undefined ? data.total : (data.items ? data.items.length : data.length))
        }
      } catch (e) {
        console.error('Erro ao carregar pedidos:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, page, limit, statusFilter, debouncedSearch])

  // Efeito separado para carregar os quantitativos de todas as abas
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const token = await getToken()
        if (token) {
          // Busca um volume maior de uma vez para calcular os totais das abas
          const data = await getPedidos(token, 1000, 0, undefined)
          const items = data.items || []
          
          const counts = {
            todos: items.filter((p: any) => p.status !== 'cancelado' && p.status !== 'concluido').length,
            pendente: items.filter((p: any) => p.status === 'pendente').length,
            em_producao: items.filter((p: any) => p.status === 'em_producao' || p.status === 'producao').length,
            concluido: items.filter((p: any) => p.status === 'concluido').length
          }
          setAllCounts(counts)
        }
      } catch (e) {
        console.error('Erro ao carregar quantitativos:', e)
      }
    }
    loadCounts()
  }, [getToken, pedidos]) // Recarrega se a lista de pedidos mudar (ex: ao excluir ou mudar status)

  const handleDelete = async () => {
    if (!pedidoToDelete) return
    setDeleting(true)
    try {
      const token = await getToken()
      if (token) {
        await deletePedido(token, pedidoToDelete.id)
        setPedidos(prev => prev.filter(p => p.id !== pedidoToDelete.id))
        setPedidoToDelete(null)
      }
    } catch (e) {
      console.error('Erro ao excluir pedido:', e)
    } finally {
      setDeleting(false)
    }
  }

  const statusOptions = ['todos', 'pendente', 'em_producao', 'concluido']
  const statusLabel: Record<string, string> = {
    todos: 'Ativos', pendente: 'Pendentes', em_producao: 'Em Produção',
    concluido: 'Concluídos'
  }

  const filtered = pedidos // O backend já está filtrando e paginando

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
          {statusOptions.map(s => {
            const isActive = statusFilter === s

            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2"
                style={isActive ? {
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
                <span
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface-container-highest)',
                    color: isActive ? '#fff' : 'var(--on-surface-variant)',
                  }}
                >
                  {allCounts[s] || 0}
                </span>
              </button>
            )
          })}
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
                            Pedido #{String(pedido.id).slice(0, 8)}
                          </p>
                          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors"
                            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                            {pedido.cliente_nome}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={pedido.status} />
                          {pedido.status === 'concluido' && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setPedidoToDelete(pedido)
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-red-50 text-red-400 hover:text-red-600"
                              title="Excluir pedido encerrado"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pedido.preco_total))}
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

      {/* Pagination Controls */}
      {!loading && filtered.length > 0 && (
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'var(--surface-container-high)' }}>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            <span>Total: {total}</span>
            <div className="flex items-center gap-2">
              <label htmlFor="limit-select">Por página:</label>
              <select
                id="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
                className="bg-transparent border rounded p-1"
                style={{ borderColor: 'var(--outline-variant)' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}
            >
              Anterior
            </button>
            <span className="text-sm font-semibold mx-2">Página {page} de {Math.ceil(total / limit) || 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}
            >
              Próxima
            </button>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {pedidoToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="layer-card p-8 max-w-md w-full space-y-6"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(179,57,56,0.10)' }}>
                <AlertTriangle className="w-8 h-8" style={{ color: 'var(--error)' }} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
                Excluir Pedido
              </h3>
              <p className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                Deseja excluir permanentemente o pedido de <strong>{pedidoToDelete.cliente_nome}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPedidoToDelete(null)}
                disabled={deleting}
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
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center"
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  background: 'linear-gradient(45deg, #b33938, #a03030)',
                  color: '#fff',
                }}
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
