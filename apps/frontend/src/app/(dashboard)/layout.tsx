import { Sidebar } from "../../components/Sidebar"
import { SyncWrapper } from "../../components/SyncWrapper"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protege todas as rotas do dashboard
  const user = await currentUser()
  if (!user) redirect("/")

  return (
    <SyncWrapper>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--surface)' }}>
        <Sidebar />
        <main className="ml-64 flex-1 min-h-screen" style={{ backgroundColor: 'var(--surface-container-low)' }}>
        {/* Padding responsivo interno */}
        <div className="max-w-[1320px] mx-auto px-8 py-10">
          {children}
        </div>
      </main>
      </div>
    </SyncWrapper>
  )
}
