'use client'

import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Save, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createPedido, getReceitas } from '../../../../lib/api'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

const STEPS = ['Cliente', 'Resumo']

export default function NovoPedidoPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [saving, setSaving]   = useState(false)
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
  })

  const [receitas, setReceitas] = useState<any[]>([])
  const [loadingReceitas, setLoadingReceitas] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoadingReceitas(true)
      try {
        const token = await getToken()
        if (token) {
          const data = await getReceitas(token)
          setReceitas(data)
        }
      } catch (e) {
        console.error('Erro ao carregar receitas:', e)
      } finally {
        setLoadingReceitas(false)
      }
    }
    load()
  }, [getToken])

  const handleSelectReceita = (id: string) => {
    const r = receitas.find(x => x.id === id)
    if (r) {
      setForm(f => ({
        ...f,
        receita_id: id,
        descricao: f.descricao ? f.descricao : r.nome,
        preco_total: f.preco_total ? f.preco_total : (r.preco_venda_sugerido?.toString() || '')
      }))
    } else {
      update('receita_id', '')
    }
  }

  const update = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }))

  // Máscara para telefone brasileiro: (XX) XXXXX-XXXX
  const applyPhoneMask = (value: string): string => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const canNext = step === 0 ? form.cliente_nome.trim() !== '' : true

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Não autenticado')
      const payload = {
        ...form,
        preco_total: form.preco_total ? parseFloat(form.preco_total) : undefined,
        status: 'pendente',
      }
      const created = await createPedido(token, payload)
      router.push(`/pedidos/${created.id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Erro ao criar pedido. Tente novamente.')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">

      {/* Back */}
      <Link href="/pedidos" className="inline-flex items-center gap-2 text-sm"
        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Cancelar
      </Link>

      {/* Title */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
          Novo Pedido
        </p>
        <h1 className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Criar Pedido
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={i <= step ? {
                  background: 'linear-gradient(45deg, #915160, #834554)',
                  color: '#fff',
                } : {
                  backgroundColor: 'var(--surface-container-high)',
                  color: 'var(--on-surface-variant)',
                }}
              >
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-jakarta)', color: i === step ? 'var(--primary)' : 'var(--on-surface-variant)' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3" style={{ backgroundColor: 'var(--surface-container-highest)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form card */}
      <div className="layer-card p-8">
        {step === 0 && (
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
              {loadingReceitas && <p className="text-[10px] mt-1 opacity-60">Carregando receitas...</p>}
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

            {/* Descrição e Observações */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
                Descrição do Pedido
              </label>
              <textarea
                rows={3}
                placeholder="Descreva o pedido brevemente..."
                className="input-field h-auto py-3 resize-none"
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
                className="input-field h-auto py-3 resize-none"
                value={form.observacoes}
                onChange={e => update('observacoes', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              Resumo do Pedido
            </h2>

            <div className="space-y-4" style={{ backgroundColor: 'var(--surface-container-low)', borderRadius: '0.75rem', padding: '1.5rem' }}>
              {[
                { label: 'Cliente', value: form.cliente_nome },
                { label: 'Telefone', value: form.cliente_tel || '—' },
                { label: 'Entrega', value: form.data_entrega ? new Date(form.data_entrega).toLocaleDateString('pt-BR') : '—' },
                { label: 'Tipo', value: form.tipo_entrega },
                { label: 'Descrição', value: form.descricao || '—' },
                { label: 'Observações', value: form.observacoes || '—' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
                    {r.label}
                  </span>
                  <span className="text-sm text-right max-w-xs"
                    style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface)' }}>
                    {r.value}
                  </span>
                </div>
              ))}
              {form.preco_total && (
                <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(188,185,173,0.20)' }}>
                  <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>Total</span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}>
                    R$ {parseFloat(form.preco_total).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: 'rgba(179,57,56,0.10)', color: 'var(--error)', fontFamily: 'var(--font-inter)' }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="btn-secondary">
            Voltar
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="btn-primary"
            style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
            style={saving ? { opacity: 0.7, cursor: 'wait' } : {}}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Finalizar Pedido'}
          </button>
        )}
      </div>
    </div>
  )
}
