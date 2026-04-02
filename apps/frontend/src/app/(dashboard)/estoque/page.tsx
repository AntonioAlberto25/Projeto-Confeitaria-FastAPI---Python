'use client'

import React, { useState } from 'react'
import { Plus, Search, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Settings2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const estoqueItems = [
    { id: 1, nome: 'Farinha de Trigo Especial', categoria: 'Secos', quantidade: 45, unidade: 'kg', estoque_minimo: 20, status: 'ok' },
    { id: 2, nome: 'Açúcar de Confeiteiro', categoria: 'Secos', quantidade: 12, unidade: 'kg', estoque_minimo: 15, status: 'alerta' },
    { id: 3, nome: 'Chocolate Belga 70%', categoria: 'Chocolates', quantidade: 8, unidade: 'kg', estoque_minimo: 5, status: 'ok' },
    { id: 4, nome: 'Manteiga Extra', categoria: 'Laticínios', quantidade: 3, unidade: 'kg', estoque_minimo: 10, status: 'critico' },
    { id: 5, nome: 'Fava de Baunilha', categoria: 'Especiarias', quantidade: 50, unidade: 'un', estoque_minimo: 10, status: 'ok' },
  ]

  const filteredEstoque = estoqueItems.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-concluido'
      case 'alerta': return 'text-tertiary'
      case 'critico': return 'text-error'
      default: return 'text-secondary'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-concluido/10'
      case 'alerta': return 'bg-tertiary/10'
      case 'critico': return 'bg-error/10'
      default: return 'bg-secondary/10'
    }
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Controle de Estoque</h1>
          <p className="text-secondary font-jakarta text-sm">Monitore insumos e gerencie reposições</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-secondary flex items-center justify-center gap-2 p-3 flex-1 md:flex-none">
             Importar 
          </button>
          <button className="btn-primary flex items-center justify-center gap-2 p-3 flex-1 md:flex-none">
            <Plus className="w-4 h-4" /> Novo Insumo
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="layer-card p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary/60 mb-1">Total de Itens</p>
            <h3 className="text-2xl font-manrope font-bold text-secondary">156</h3>
          </div>
        </div>
        <div className="layer-card p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-tertiary/10">
              <AlertTriangle className="w-5 h-5 text-tertiary" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary/60 mb-1">Itens em Alerta</p>
            <h3 className="text-2xl font-manrope font-bold text-tertiary">14</h3>
          </div>
        </div>
        <div className="layer-card p-6 flex flex-col gap-4 border-l-4 border-l-error">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-error/10">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary/60 mb-1">Estoque Crítico</p>
            <h3 className="text-2xl font-manrope font-bold text-error">03</h3>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar insumo ou categoria..." 
              className="w-full h-12 pl-12 pr-4 bg-surface-container-highest/20 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 focus:bg-white transition-all font-jakarta text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="layer-card overflow-hidden">
          <table className="w-full text-left font-jakarta text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-highest/20">
                <th className="px-6 py-4 font-bold text-secondary/80">Insumo</th>
                <th className="px-6 py-4 font-bold text-secondary/80">Categoria</th>
                <th className="px-6 py-4 font-bold text-secondary/80">Qtd. Atual</th>
                <th className="px-6 py-4 font-bold text-secondary/80">Mínimo</th>
                <th className="px-6 py-4 font-bold text-secondary/80">Status</th>
                <th className="px-6 py-4 font-bold text-secondary/80 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredEstoque.map((item, i) => (
                <tr key={item.id} className="hover:bg-surface-container-low/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-secondary">{item.nome}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-secondary/40 uppercase tracking-widest">{item.categoria}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-secondary/80">
                    {item.quantidade} {item.unidade}
                  </td>
                  <td className="px-6 py-4 text-secondary/40">{item.estoque_minimo} {item.unidade}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusBg(item.status)} ${getStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 hover:bg-secondary/5 rounded-md transition-colors text-secondary/40 hover:text-primary">
                        <ArrowUpRight className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-secondary/5 rounded-md transition-colors text-secondary/40 hover:text-error">
                        <ArrowDownRight className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-secondary/5 rounded-md transition-colors text-secondary/40 hover:text-secondary">
                        <Settings2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
