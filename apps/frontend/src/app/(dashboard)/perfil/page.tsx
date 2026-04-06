'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { UserProfile } from '@clerk/nextjs'
import { ArrowLeft, User } from 'lucide-react'
import { getMeuPerfil } from '../../../lib/api'
import Link from 'next/link'

export default function PerfilPage() {
  const { getToken } = useAuth()
  const [perfil, setPerfil]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        if (token) {
          const data = await getMeuPerfil(token)
          setPerfil(data)
        }
      } catch (e) {
        console.error('Perfil não encontrado no backend:', e)
        // Ainda mostra o UserProfile do Clerk abaixo
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  return (
    <div className="space-y-8 animate-fade-in pb-20">

      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm"
        style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}>
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-inter)', color: 'var(--outline-variant)' }}>
          Conta
        </p>
        <h1 className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
          Perfil
        </h1>
      </div>

      {/* Backend profile info (se disponível) */}
      {!loading && perfil && (
        <div className="layer-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fbabbc 0%, #ffdcc2 100%)' }}>
            <User className="w-6 h-6" style={{ color: '#915160' }} />
          </div>
          <div>
            <p className="font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface)' }}>
              {perfil.nome ?? perfil.name ?? 'Usuário'}
            </p>
            <p className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}>
              {perfil.email}
            </p>
          </div>
        </div>
      )}

      {/* Clerk UserProfile — gestão completa de conta */}
      <div className="layer-card overflow-hidden">
        <UserProfile
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: {
                boxShadow: 'none',
                border: 'none',
                backgroundColor: 'transparent',
                width: '100%',
              },
            },
          }}
        />
      </div>
    </div>
  )
}
