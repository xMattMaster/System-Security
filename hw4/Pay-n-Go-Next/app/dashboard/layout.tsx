"use server"

import "server-only";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import pg_query from "@/lib/pgpool";
import CompleteRegistration from "@/components/dashboard/complete-registration";
import DashboardContent from "@/components/dashboard/dashboard-content";

interface ClientData {
    id: string;
    nome: string;
    cognome: string;
    datanascita: Date;
    codicefiscale: string;
    indirizzo: string;
    codicePagamento: string | null;
    tipoPagamento: string | null;
}

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }
    let user: ClientData | null = null;

    try {
        const query = "SELECT * FROM clienti WHERE id = $1";
        const result = await pg_query(query, [session.user.id])

        if (result.rows.length > 0) {
            user = result.rows[0];
        }
    } catch (error) {
        console.error("Errore database:", error);
        return <div>Errore nel caricamento dei dati.</div>;
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <CompleteRegistration user={session.user}/>
            </div>
        );
    }

    const userGroups = session.user.groups || [];

    return (
        <DashboardContent user={user} groups={userGroups}>
            {children}
        </DashboardContent>
    );
}
