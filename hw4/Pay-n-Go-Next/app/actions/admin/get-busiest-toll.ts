"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';
import {requireAdmin} from "@/lib/admin";

interface BusiestTollData {
    casello_id: number;
    codice: string;
    numero: number;
    numero_passaggi: number;
}

export async function getBusiestToll() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: null};
    }

    // Verifica permessi amministratore
    try {
        await requireAdmin();
    } catch (error) {
        return {res: -1, message: "Accesso negato: privilegi di amministratore richiesti", data: null};
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
            LIMIT 1
        `;
        
        const result = await pg_query<BusiestTollData>(query);

        if (result.rows.length === 0) {
            return {res: -1, message: "Nessun dato disponibile", data: null};
        }

        return {res: 1, message: "OK", data: result.rows[0]};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero casello più trafficato:', error);
        }
        return {res: -1, message: "Errore del server", data: null};
    }
}
