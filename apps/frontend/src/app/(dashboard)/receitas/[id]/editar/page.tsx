'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save, ChefHat } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { getReceita, updateReceita } from '../../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

export default function EditarReceitaPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (!token || !id) throw new Error('Não autenticado')

        const data = await getReceita(token, id as string)
        setForm({
          nome: data.nome || '',
          descricao: data.descricao || '',
          tempo_preparo: data.tempo_preparo != null ? String(data.tempo_preparo) : '',
          rendimento: data.rendimento != null ? String(data.rendimento) : '',
          modo_preparo: data.modo_preparo || '',
          preco_venda_sugerido: data.preco_venda_sugerido != null ? String(data.preco_venda_sugerido) : '',
        })
      } catch (e) {
        setError('Erro ao carregar receita. Tente novamente.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, id])

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      setError('O nome da receita é obrigatório.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')

      const payload = {
        nome: form.nome,
        descricao: form.descricao || undefined,
        rendimento: form.rendimento ? parseInt(form.rendimento, 10) : undefined,
        tempo_preparo: form.tempo_preparo ? parseInt(form.tempo_preparo, 10) : undefined,
        modo_preparo: form.modo_preparo || undefined,
        preco_venda_sugerido: form.preco_venda_sugerido ? parseFloat(form.preco_venda_sugerido) : undefined,
      }

      await updateReceita(token, id as string, payload)
      router.push(`/receitas/${id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Erro ao atualizar receita. Tente novamente.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in pb-20 max-w-2xl mx-auto">
        <div className="h-10 w-64 rounded-xl animate-skeleton" style={{ backgroundColor: 'var(--surface-container-high)' }} />
        <div className="layer-card h-96 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between gap-4">
        <Link href={`/receitas/${id}`} className="inline-flex items-center gap-2 text-sm"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
          <ArrowLeft className="w-4 h-4" /> Voltar para Receita
        </Link>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
            Fichas Técnicas
          </p>
          <h1 className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Editar Receita
          </h1>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(179,57,56,0.10)', color: 'var(--error)', fontFamily: 'var(--font-inter)' }}>
          {error}
        </div>
      )}

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
          { label: 'Rendimento', field: 'rendimento', type: 'number', placeholder: 'Insira o numero' },
          { label: 'Tempo de Preparo (min)', field: 'tempo_preparo', type: 'number', placeholder: '60' },
          { label: 'Preço de Venda Sugerido (R$)', field: 'preco_venda_sugerido', type: 'number', placeholder: '0,00' },
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
                onChange={e => updateField(f.field, e.target.value)}
              />
            ) : (
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="input-field"
                value={(form as any)[f.field]}
                onChange={e => updateField(f.field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="layer-card p-8 space-y-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Modo de Preparo
        </h2>
        <textarea
          rows={8}
          placeholder="Descreva o passo a passo da receita..."
          className="input-field h-auto py-4 resize-y min-h-[150px]"
          value={form.modo_preparo}
          onChange={e => updateField('modo_preparo', e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
          style={saving ? { opacity: 0.7, cursor: 'wait' } : {}}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Atualizar Receita'}
        </button>
      </div>
    </div>
  )
}
