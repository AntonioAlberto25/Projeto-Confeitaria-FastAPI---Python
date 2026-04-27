'use client'

import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2, ChefHat, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createReceita } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'


export default function NovaReceitaPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    tempo_preparo: '',
    rendimento: '',
    modo_preparo: '',
    preco_venda_sugerido: '',
  })

  const applyCurrencyMask = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 10)
    const numberValue = parseInt(cleanValue || '0', 10) / 100
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue)
  }

  const applyNumericMask = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 6)
  }

  const update = (field: string, val: string) => {
    let finalValue = val
    if (field === 'preco_venda_sugerido') {
      finalValue = applyCurrencyMask(val)
    } else if (field === 'rendimento' || field === 'tempo_preparo') {
      finalValue = applyNumericMask(val)
    }
    setForm(f => ({ ...f, [field]: finalValue }))
  }

  const handleSubmit = async () => {
    if (!form.nome.trim()) { setError('O nome da receita é obrigatório.'); return }

    const rendimento = form.rendimento ? parseInt(form.rendimento) : null
    if (rendimento !== null && rendimento <= 0) {
      setError('O rendimento deve ser maior que zero.')
      return
    }
    const tempo_preparo = form.tempo_preparo ? parseInt(form.tempo_preparo) : null
    if (tempo_preparo !== null && tempo_preparo <= 0) {
      setError('O tempo de preparo deve ser maior que zero.')
      return
    }
    const preco = form.preco_venda_sugerido 
      ? parseFloat(form.preco_venda_sugerido.replace(/\./g, '').replace(',', '.')) 
      : null
    if (preco !== null && preco <= 0) {
      setError('O preço de venda deve ser maior que zero.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')
      const payload = {
        ...form,
        rendimento: rendimento ?? undefined,
        tempo_preparo: tempo_preparo ?? undefined,
        preco_venda_sugerido: preco ?? undefined,
      }
      await createReceita(token, payload)
      router.push('/receitas')
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
          { label: 'Nome da Receita *', field: 'nome', type: 'text', placeholder: 'Ex: Bolo de Chocolate Belga', min: undefined },
          { label: 'Descrição', field: 'descricao', type: 'text', placeholder: 'Breve descrição da receita...', min: undefined },
          { label: 'Rendimento (unidades) *', field: 'rendimento', type: 'text', placeholder: 'Ex: 12 (deve ser ≥ 1)', min: undefined },
          { label: 'Tempo de Preparo (min)', field: 'tempo_preparo', type: 'text', placeholder: '60', min: undefined },
          { label: 'Preço de Venda Sugerido (R$)', field: 'preco_venda_sugerido', type: 'text', placeholder: '0,00', min: undefined },
        ].map(f => (
          <div key={f.field}>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              {f.label}
            </label>
            {f.field === 'descricao' ? (
              <textarea
                placeholder={f.placeholder}
                className="input-field h-auto py-3 resize-y min-h-[80px]"
                rows={3}
                value={(form as any)[f.field]}
                onChange={e => update(f.field, e.target.value)}
              />
            ) : (
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="input-field"
                min={f.min}
                value={(form as any)[f.field]}
                onChange={e => update(f.field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modo de Preparo */}
      <div className="layer-card p-8 space-y-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Modo de Preparo
        </h2>
        <textarea
          rows={8}
          placeholder="Descreva o passo a passo da receita..."
          className="input-field h-auto py-4 resize-y min-h-[150px]"
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
