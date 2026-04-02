'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { LayoutDashboard, ShoppingCart, BookText, Package, ChefHat, Settings, LogOut, Flame } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/producao', label: 'Produção', icon: Flame },
  { href: '/receitas', label: 'Receitas', icon: BookText },
  { href: '/estoque', label: 'Estoque', icon: Package },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-surface border-r border-surface-container-highest/20 z-50 flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ChefHat className="w-6 h-6 text-primary" />
        </div>
        <span className="font-manrope font-bold text-lg text-primary tracking-tight">Artisan Baker <span className="text-secondary font-medium italic">Pro</span></span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-3",
                isActive 
                  ? "bg-primary/5 text-primary shadow-sm" 
                  : "text-secondary hover:bg-secondary/5"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-secondary/60")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-surface-container-highest/20 flex flex-col gap-1">
        <div className="flex items-center justify-between px-4 py-3 mb-4">
          <UserButton afterSignOutUrl="/" showName />
        </div>
        <SignOutButton>
          <button className="px-4 py-3 rounded-md text-sm font-medium text-secondary hover:bg-error/5 hover:text-error transition-all flex items-center gap-3 w-full text-left">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
