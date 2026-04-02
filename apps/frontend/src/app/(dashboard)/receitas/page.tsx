'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, BookOpen, Clock, Users, ArrowRight, Share2, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getReceitas } from '../../../lib/api'
import { useAuth } from '@clerk/nextjs'

export default function ReceitasPage() {
  const { getToken } = useAuth()
  const [receitas, setReceitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadReceitas = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getReceitas(token)
          setReceitas(data)
        }
      } catch (error) {
        console.error('Erro ao carregar receitas:', error)
        // Mock data
        setReceitas([
          { id: 1, nome: 'Pão de Ló Clássico', descricao: 'Receita base para bolos recheados, leve e aerada.', tempo_preparo: 45, rendimento: '1 bolo médio', dificuldade: 'Fácil' },
          { id: 2, nome: 'Creme Patissière', descricao: 'Creme de confeiteiro tradicional com favas de baunilha.', tempo_preparo: 20, rendimento: '500g', dificuldade: 'Média' },
          { id: 3, nome: 'Massa Folhada', descricao: 'Massa amanteigada feita à mão com dobras artesanais.', tempo_preparo: 180, rendimento: '1kg', dificuldade: 'Difícil' },
          { id: 4, nome: 'Brigadeiro Belga', descricao: 'Ponto de bico para decoração premium.', tempo_preparo: 25, rendimento: '30 unidades', dificuldade: 'Fácil' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadReceitas()
  }, [getToken])

  const filteredReceitas = receitas.filter(r => 
    r.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Acervo de Receitas</h1>
          <p className="text-secondary font-jakarta text-sm">Organize suas criações e segredos culinários</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 p-3 w-full md:w-auto">
          <Plus className="w-4 h-4" /> Nova Receita
        </button>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            className="w-full h-12 pl-12 pr-4 bg-surface-container-highest/20 rounded-md border border-secondary/10 focus:outline-none focus:border-primary/30 focus:bg-white transition-all font-jakarta text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['Todos', 'Massas', 'Recheios', 'Coberturas'].map((cat) => (
            <button key={cat} className={`h-12 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${cat === 'Todos' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-secondary/40 hover:text-secondary'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Receitas */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="layer-card h-80 p-6 animate-pulse bg-surface-container-low" />
            ))
          ) : (
            filteredReceitas.map((receita, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                key={receita.id}
                className="layer-card group hover:scale-[1.02] transition-all duration-500 overflow-hidden cursor-pointer"
              >
                <div className="h-24 bg-gradient-to-br from-primary/20 to-surface-container-highest/50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 blur-xl flex items-center justify-center">
                    <BookOpen className="w-32 h-32 text-primary" />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors text-secondary/40 hover:text-error active:scale-95">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors text-secondary/40 hover:text-primary active:scale-95">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-manrope font-bold text-xl text-secondary group-hover:text-primary transition-colors leading-tight">
                      {receita.nome}
                    </h3>
                    <p className="text-sm font-jakarta text-secondary/50 line-clamp-2">{receita.descricao}</p>
                  </div>

                  <div className="flex items-center gap-6 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-secondary/30 tracking-widest">Tempo</span>
                      <div className="flex items-center gap-1.5 text-secondary font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-xs">{receita.tempo_preparo} min</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-secondary/30 tracking-widest">Rendimento</span>
                      <div className="flex items-center gap-1.5 text-secondary font-medium">
                        <Users className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-xs">{receita.rendimento}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 ml-auto text-right">
                      <span className="text-[10px] uppercase font-bold text-secondary/30 tracking-widest">Dificuldade</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        receita.dificuldade === 'Fácil' ? 'bg-concluido/10 text-concluido' : 
                        receita.dificuldade === 'Média' ? 'bg-producao/10 text-producao' : 'bg-error/10 text-error'
                      }`}>
                        {receita.dificuldade}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-container-highest/20 flex justify-between items-center group/btn">
                    <span className="text-sm font-bold text-primary opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Ver modo de preparo</span>
                    <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary text-secondary/40 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-4 h-4 translate-x-[-1px]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
