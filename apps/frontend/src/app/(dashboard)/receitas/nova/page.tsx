'use client'

import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2, ChefHat, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createReceita } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

interface Ingrediente {
  nome: string
  quantidade: string
  unidade: string
}

export default function NovaReceitaPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const [form, setForm] = useState({
    nome:                 '',
    descricao:            '',
    tempo_preparo:        '',
    rendimento:           '',
    modo_preparo:         '',
    preco_venda_sugerido: '',
  })

  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { nome: '', quantidade: '', unidade: '' },
  ])

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }))

  const addIng = () => setIngredientes(prev => [...prev, { nome: '', quantidade: '', unidade: '' }])
  const removeIng = (i: number) => setIngredientes(prev => prev.filter((_, idx) => idx !== i))
  const updateIng = (i: number, field: keyof Ingrediente, val: string) => {
    setIngredientes(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing))
  }

  const handleSubmit = async () => {
    if (!form.nome.trim()) { setError('O nome da receita é obrigatório.'); return }
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')
      const ingsLimpos = ingredientes.filter(i => i.nome.trim())
      const payload = {
        ...form,
        tempo_preparo: form.tempo_preparo ? parseInt(form.tempo_preparo) : undefined,
        preco_venda_sugerido: form.preco_venda_sugerido ? parseFloat(form.preco_venda_sugerido) : undefined,
        ingredientes: JSON.stringify(ingsLimpos),
      }
      const created = await createReceita(token, payload)
      router.push(`/receitas/${created.id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Erro ao criar receita. Tente novamente.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">

      <Link href="/receitas" className="inline-flex items-center gap-2 text-sm"
        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
          Fichas Técnicas
        </p>
        <h1 className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Nova Receita
        </h1>
      </div>

      {/* Dados básicos */}
      <div className="layer-card p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fbabbc, #ffdcc2)' }}>
            <ChefHat className="w-4 h-4" style={{ color: '#915160' }} />
          </div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Identificação
          </h2>
        </div>

        {[
          { label: 'Nome da Receita *', field: 'nome', type: 'text', placeholder: 'Ex: Bolo de Chocolate Belga' },
          { label: 'Descrição', field: 'descricao', type: 'text', placeholder: 'Breve descrição da receita...' },
          { label: 'Rendimento', field: 'rendimento', type: 'text', placeholder: 'Ex: 12 porções, 1 forma de 20cm' },
          { label: 'Tempo de Preparo (min)', field: 'tempo_preparo', type: 'number', placeholder: '60' },
          { label: 'Preço de Venda Sugerido (R$)', field: 'preco_venda_sugerido', type: 'number', placeholder: '0,00' },
        ].map(f => (
          <div key={f.field}>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              className="input-field"
              value={(form as any)[f.field]}
              onChange={e => update(f.field, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Ingredientes */}
      <div className="layer-card p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Ingredientes
          </h2>
          <button onClick={addIng} className="btn-secondary h-9 px-4 text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {ingredientes.map((ing, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" placeholder="Ingrediente" className="input-field flex-1"
                value={ing.nome} onChange={e => updateIng(i, 'nome', e.target.value)} />
              <input type="text" placeholder="Qtd" className="input-field w-24"
                value={ing.quantidade} onChange={e => updateIng(i, 'quantidade', e.target.value)} />
              <input type="text" placeholder="Un." className="input-field w-20"
                value={ing.unidade} onChange={e => updateIng(i, 'unidade', e.target.value)} />
              {ingredientes.length > 1 && (
                <button onClick={() => removeIng(i)} className="p-2 rounded-lg flex-shrink-0 transition-colors"
                  style={{ color: 'var(--error)' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modo de Preparo */}
      <div className="layer-card p-8 space-y-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Modo de Preparo
        </h2>
        <textarea
          rows={8}
          placeholder="Descreva o passo a passo da receita..."
          className="input-field h-auto py-4 resize-none"
          value={form.modo_preparo}
          onChange={e => update('modo_preparo', e.target.value)}
        />
      </div>

      {/* Error + Submit */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(179,57,56,0.10)', color: 'var(--error)', fontFamily: 'var(--font-inter)' }}>
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
          style={saving ? { opacity: 0.7, cursor: 'wait' } : {}}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Receita'}
        </button>
      </div>
    </div>
  )
}
