"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface TripData {
    id: string;
    numtragitto: number;
    dispositivo: number;
    casingresso: string;
    dataoraingresso: string;
    casuscita: string;
    dataorauscita: string;
}

export async function getTrips() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: []};
    }

    try {
        const query = `
            SELECT 
                CONCAT(t.numtragitto, '.', t.dispositivo) AS id, 
                t.numtragitto,
                t.dispositivo,
                CONCAT(c1.codice, ', ', c1.numero) AS casingresso,
                t.dataoraingresso AS dataoraingresso,
                CONCAT(c2.codice, ', ', c2.numero) AS casuscita,
                t.dataorauscita AS dataorauscita
            FROM tragitti t 
            JOIN caselli c1 ON t.casello_ingresso = c1.id 
            JOIN caselli c2 ON t.casello_uscita = c2.id
            WHERE t.dispositivo IN (
                SELECT ada.dispositivo
                FROM appartenenze_auto aa 
                JOIN automobili a ON aa.automobile = a.targa 
                JOIN associazioni_disp_auto ada ON a.targa = ada.automobile
                WHERE aa.cliente = $1
            )
            ORDER BY t.dataorauscita DESC
        `;
        
        const result = await pg_query<TripData>(query, [session.user.id]);

        return {res: 1, message: "OK", data: result.rows};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero tragitti:', error);
        }
        return {res: -1, message: "Errore del server", data: []};
    }
}
