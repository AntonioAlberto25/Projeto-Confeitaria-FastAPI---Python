'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { getPedido, updatePedido, getReceitas } from '../../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

export default function EditarPedidoPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const [form, setForm] = useState({
    cliente_nome:  '',
    cliente_tel:   '',
    data_entrega:  '',
    tipo_entrega:  'Retirada',
    descricao:     '',
    observacoes:   '',
    preco_total:   '',
    receita_id:    '',
    status:        '',
    endereco_entrega: '',
  })

  const [receitas, setReceitas] = useState<any[]>([])
  const [loadingReceitas, setLoadingReceitas] = useState(false)

  // Carregar dados do pedido existente
  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token && id) {
          const [pedidoData, receitasData] = await Promise.all([
            getPedido(token, id as string),
            getReceitas(token).catch(() => []),
          ])
          setReceitas(receitasData)
          setForm({
            cliente_nome:  pedidoData.cliente_nome || '',
            cliente_tel:   pedidoData.cliente_tel || '',
            data_entrega:  pedidoData.data_entrega || '',
            tipo_entrega:  pedidoData.tipo_entrega || 'Retirada',
            descricao:     pedidoData.descricao || '',
            observacoes:   pedidoData.observacoes || '',
            preco_total:   pedidoData.preco_total?.toString() || '',
            receita_id:    pedidoData.receita_id || '',
            status:        pedidoData.status || 'pendente',
            endereco_entrega: pedidoData.endereco_entrega || '',
          })
        }
      } catch (e) {
        console.error('Erro ao carregar pedido:', e)
        setError('Não foi possível carregar os dados do pedido.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken, id])

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }))

  // Máscara para telefone brasileiro: (XX) XXXXX-XXXX
  const applyPhoneMask = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSelectReceita = (receitaId: string) => {
    const r = receitas.find(x => x.id === receitaId)
    if (r) {
      setForm(f => ({
        ...f,
        receita_id: receitaId,
        descricao: f.descricao ? f.descricao : r.nome,
        preco_total: f.preco_total ? f.preco_total : (r.preco_venda_sugerido?.toString() || '')
      }))
    } else {
      update('receita_id', '')
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')
      const payload = {
        ...form,
        preco_total: form.preco_total ? parseFloat(form.preco_total) : undefined,
      }
      await updatePedido(token, id as string, payload)
      router.push(`/pedidos/${id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Erro ao salvar alterações. Tente novamente.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="h-8 w-48 rounded-lg animate-skeleton" style={{ backgroundColor: 'var(--surface-container-high)' }} />
        <div className="layer-card h-96 animate-skeleton" style={{ backgroundColor: 'var(--surface-container-low)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Back */}
      <Link href={`/pedidos/${id}`} className="inline-flex items-center gap-2 text-sm"
        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      {/* Title */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
          Pedido #{String(id).slice(0, 8)}
        </p>
        <h1 className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Editar Pedido
        </h1>
      </div>

      {/* Form card */}
      <div className="layer-card p-8">
        <div className="space-y-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
            Informações do Cliente e Pedido
          </h2>

          {/* Seletor de Receita */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              Vincular a uma Receita (Opcional)
            </label>
            <select
              className="input-field"
              value={form.receita_id}
              onChange={e => handleSelectReceita(e.target.value)}
              disabled={loadingReceitas}
            >
              <option value="">Nenhuma receita selecionada</option>
              {receitas.map(r => (
                <option key={r.id} value={r.id}>{r.nome}</option>
              ))}
            </select>
          </div>

          {[
            { label: 'Nome do Cliente *', field: 'cliente_nome', type: 'text', placeholder: 'Ex: Ana Silva' },
            { label: 'Telefone', field: 'cliente_tel', type: 'tel', placeholder: '(11) 99999-9999' },
            { label: 'Data de Entrega', field: 'data_entrega', type: 'date', placeholder: '' },
            { label: 'Preço Total (R$)', field: 'preco_total', type: 'number', placeholder: '0,00' },
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
                onChange={e => {
                  if (f.field === 'cliente_tel') {
                    update(f.field, applyPhoneMask(e.target.value))
                  } else {
                    update(f.field, e.target.value)
                  }
                }}
                maxLength={f.field === 'cliente_tel' ? 15 : undefined}
              />
            </div>
          ))}

          {/* Tipo Entrega */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              Tipo de Entrega
            </label>
            <div className="flex gap-3">
              {['Retirada', 'Entrega'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update('tipo_entrega', t)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={form.tipo_entrega === t ? {
                    background: 'linear-gradient(45deg, #915160, #834554)',
                    color: '#fff',
                    fontFamily: 'var(--font-jakarta)',
                  } : {
                    backgroundColor: 'var(--surface-container-high)',
                    color: 'var(--on-surface-variant)',
                    fontFamily: 'var(--font-jakarta)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Endereço de Entrega */}
          {form.tipo_entrega === 'Entrega' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                Endereço de Entrega
              </label>
              <textarea
                placeholder="Rua, Número, Bairro, Ponto de Referência..."
                className="input-field resize-y min-h-[80px]"
                value={form.endereco_entrega}
                onChange={e => update('endereco_entrega', e.target.value)}
              />
            </div>
          )}

          {/* Descrição e Observações */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              Descrição do Pedido
            </label>
            <textarea
              rows={3}
              placeholder="Descreva o pedido brevemente..."
              className="input-field h-auto py-3 resize-y min-h-[80px]"
              value={form.descricao}
              onChange={e => update('descricao', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              Observações
            </label>
            <textarea
              rows={2}
              placeholder="Alergias, preferências especiais, etc..."
              className="input-field h-auto py-3 resize-y min-h-[80px]"
              value={form.observacoes}
              onChange={e => update('observacoes', e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: 'rgba(179,57,56,0.10)', color: 'var(--error)', fontFamily: 'var(--font-inter)' }}>
            {error}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Link href={`/pedidos/${id}`} className="btn-secondary">
          Cancelar
        </Link>
        <button
          onClick={handleSubmit}
          disabled={saving || !form.cliente_nome.trim()}
          className="btn-primary flex items-center gap-2"
          style={(saving || !form.cliente_nome.trim()) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}
