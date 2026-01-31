"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';
import {requireAdmin} from "@/lib/admin";

interface TollStatsData {
    casello_id: number;
    codice: string;
    numero: number;
    numero_passaggi: number;
}

export async function getAllTollStats() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: []};
    }

    // Verifica permessi amministratore
    try {
        await requireAdmin();
    } catch (error) {
        return {res: -1, message: "Accesso negato: privilegi di amministratore richiesti", data: []};
    }

    try {
        const query = `
            SELECT 
                c.id AS casello_id,
                c.codice,
                c.numero,
                COUNT(*) AS numero_passaggi
            FROM tragitti t 
            JOIN caselli c ON t.casello_ingresso = c.id
            GROUP BY c.id, c.codice, c.numero
            ORDER BY COUNT(*) DESC
        `;
        
        const result = await pg_query<TollStatsData>(query);

        return {res: 1, message: "OK", data: result.rows};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero statistiche caselli:', error);
        }
        return {res: -1, message: "Errore del server", data: []};
    }
}
