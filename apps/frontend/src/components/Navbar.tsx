'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, ShoppingCart, BookText, Package, ChefHat } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/receitas', label: 'Receitas', icon: BookText },
]

export const Navbar = () => {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <span className="font-manrope font-bold text-lg text-primary tracking-tight">Artisan Baker <span className="text-secondary font-medium">Pro</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-secondary hover:bg-secondary/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-secondary/60")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
