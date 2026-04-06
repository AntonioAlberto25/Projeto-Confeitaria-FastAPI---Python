'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { LayoutDashboard, ShoppingCart, BookText, Package, ChefHat, Settings, LogOut, User } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/pedidos',   label: 'Pedidos',        icon: ShoppingCart },
  { href: '/receitas',  label: 'Receitas',       icon: BookText },
  { href: '/estoque',   label: 'Estoque',        icon: Package },
  { href: '/perfil',    label: 'Perfil',         icon: User },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 fixed top-0 left-0 h-screen z-50 flex flex-col overflow-y-auto"
      style={{ backgroundColor: 'var(--surface)', borderRight: '1px solid rgba(188,185,173,0.2)' }}
    >
      {/* Logo — glassmorphism leve */}
      <div
        className="flex items-center gap-3 px-6 py-6 mb-2"
        style={{ borderBottom: '1px solid rgba(188,185,173,0.12)' }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #fbabbc 0%, #ffdcc2 100%)' }}
        >
          <ChefHat className="w-5 h-5" style={{ color: '#915160' }} />
        </div>
        <div>
          <span
            className="block text-base font-bold leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--primary)' }}
          >
            Artisan Baker
          </span>
          <span
            className="block text-xs font-medium"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--on-surface-variant)' }}
          >
            O Ateliê Digital
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'hover:bg-surface-container-low'
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(251,171,188,0.15) 0%, rgba(255,220,194,0.10) 100%)',
                color: 'var(--primary)',
              } : {
                color: 'var(--on-surface-variant)',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
              )}
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)', opacity: isActive ? 1 : 0.7 }}
              />
              <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: isActive ? 600 : 500 }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer — UserButton + SignOut */}
      <div
        className="px-3 pb-6 pt-4"
        style={{ borderTop: '1px solid rgba(188,185,173,0.12)' }}
      >
        <div className="px-4 py-2 mb-1">
          <UserButton afterSignOutUrl="/" showName />
        </div>
        <SignOutButton>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-all duration-200"
            style={{ fontFamily: 'var(--font-jakarta)', color: 'var(--on-surface-variant)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(179,57,56,0.06)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--error)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0 opacity-70" />
            Sair
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
