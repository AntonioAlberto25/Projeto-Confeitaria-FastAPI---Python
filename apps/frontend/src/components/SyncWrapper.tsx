'use client'

import React, { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { getMeuPerfil, sincronizarPerfil } from '../lib/api'

export const SyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    const sync = async () => {
      if (!user) return
      
      try {
        const token = await getToken()
        if (!token) return

        // 1. Tenta buscar o perfil
        try {
          await getMeuPerfil(token)
          // Se chegou aqui, já existe no banco
        } catch (error: any) {
          // 2. Se for 404, tenta sincronizar
          if (error.response?.status === 404) {
            console.log('Sincronizando usuário com o backend...')
            await sincronizarPerfil(token, {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              first_name: user.firstName || '',
              last_name: user.lastName || '',
              role: 'Confeiteiro'
            })
          }
        }
      } catch (e) {
        console.error('Erro na sincronização automática:', e)
      }
    }

    sync()
  }, [user, getToken])

  return <>{children}</>
}
