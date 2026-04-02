'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, ShoppingBasket, MoreVertical, Calendar, Clock, MapPin, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPedidos } from '../../../lib/api'
import { cn } from '../../../lib/utils'
import { useAuth } from '@clerk/nextjs'

export default function PedidosPage() {
  const { getToken } = useAuth()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getPedidos(token)
          setPedidos(data)
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
        // Mock data for display if API fails
        setPedidos([
          { id: 1, cliente_nome: 'Ana Silva', descricao: 'Bolo de Chocolate Belga', preco_total: 120.0, data_entrega: '2026-04-05', status: 'pendente', tipo_entrega: 'Retirada' },
          { id: 2, cliente_nome: 'João Pedro', descricao: '24 Brigadeiros Gourmet', preco_total: 48.0, data_entrega: '2026-04-02', status: 'concluido', tipo_entrega: 'Entrega' },
          { id: 3, cliente_nome: 'Maria Lucia', descricao: 'Torta de Limão Siciliano', preco_total: 85.0, data_entrega: '2026-04-03', status: 'producao', tipo_entrega: 'Entrega' },
          { id: 4, cliente_nome: 'Carlos Eduardo', descricao: '12 Croissants Recheados', preco_total: 72.0, data_entrega: '2026-04-04', status: 'cancelado', tipo_entrega: 'Retirada' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadPedidos()
  }, [getToken])

  const filteredPedidos = pedidos.filter(p => 
    p.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'badge-pendente'
      case 'producao': case 'em_producao': return 'badge-producao'
      case 'concluido': return 'badge-concluido'
      case 'cancelado': return 'badge-cancelado'
      default: return 'badge-pendente'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'Pendente'
      case 'producao': case 'em_producao': return 'Em Produção'
      case 'concluido': return 'Concluído'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Listagem de Pedidos</h1>
          <p className="text-secondary font-jakarta text-sm">Gerencie suas encomendas e prazos de entrega</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 p-3 w-full md:w-auto">
          <Plus className="w-4 h-4" /> Novo Pedido
        </button>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Pesquisar por cliente ou item..." 
            className="w-full h-12 pl-12 pr-4 bg-surface-container-highest/20 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 focus:bg-white transition-all font-jakarta text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary flex items-center justify-center gap-2 h-12 px-6">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </section>

      {/* Grid of Pedidos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="layer-card h-64 p-6 animate-pulse bg-surface-container-low" />
            ))
          ) : (
            filteredPedidos.map((pedido, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={pedido.id}
                className="layer-card group hover:scale-[1.02] cursor-default transition-all duration-300 relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className={cn("h-1 w-full absolute top-0 left-0", getStatusBadge(pedido.status))} />
                
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-manrope font-bold text-lg text-secondary group-hover:text-primary transition-colors leading-tight">
                        {pedido.cliente_nome}
                      </h3>
                      <p className="text-xs font-bold text-secondary/30 uppercase tracking-widest">Pedido #{pedido.id}</p>
                    </div>
                    <button className="p-1 hover:bg-secondary/5 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4 text-secondary/40" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-jakarta text-secondary/70 line-clamp-2 italic">"{pedido.descricao}"</p>
                  </div>

                  <div className="pt-4 grid grid-cols-2 gap-4 border-t border-surface-container-highest/20">
                    <div className="flex items-center gap-2 text-xs text-secondary/60">
                      <Calendar className="w-3.5 h-3.5" />
                      {pedido.data_entrega}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary/60">
                      <MapPin className="w-3.5 h-3.5" />
                      {pedido.tipo_entrega}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-lg font-manrope font-bold text-primary">
                      R$ {pedido.preco_total.toFixed(2)}
                    </div>
                    <span className={cn("badge", getStatusBadge(pedido.status))}>
                      {getStatusLabel(pedido.status)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {filteredPedidos.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-8 bg-surface-container-low rounded-full">
            <ShoppingBasket className="w-16 h-16 text-secondary/20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-manrope font-bold text-secondary">Nenhum pedido encontrado</h3>
            <p className="text-secondary/50 font-jakarta max-w-xs">Não encontramos pedidos com o termo pesquisado.</p>
          </div>
          <button onClick={() => setSearchTerm('')} className="btn-secondary mt-4">Limpar Pesquisa</button>
        </div>
      )}
    </div>
  )
}
