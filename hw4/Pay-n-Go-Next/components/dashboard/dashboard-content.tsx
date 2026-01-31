"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { useContext, createContext, ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface ClientData {
    id: string
    nome: string
    cognome: string
    datanascita: Date
    codicefiscale: string
    indirizzo: string
    codicePagamento: string | null
    tipoPagamento: string | null
}

interface UserContextType {
    user: ClientData
    groups: string[]
}

export const UserContext = createContext<UserContextType | null>(null)

export function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser deve essere usato dentro DashboardContent")
    return context.user
}

export function useUserGroups() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUserGroups deve essere usato dentro DashboardContent")
    return context.groups
}

interface DashboardContentProps {
    user: ClientData
    groups: string[]
    children: ReactNode
}

export default function DashboardContent({ user, groups, children }: DashboardContentProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <UserContext.Provider value={{ user, groups }}>
            {/* Mobile menu button in top bar */}
            <div className="md:hidden fixed bottom-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background border shadow-sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </UserContext.Provider>
    )
}