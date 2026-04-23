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
        <main
          className="flex-1 min-h-screen ml-0 md:ml-64 pt-[60px] md:pt-0"
          style={{ backgroundColor: 'var(--surface-container-low)' }}
        >
          {/* Padding responsivo interno */}
          <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-6 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </SyncWrapper>
  )
}
