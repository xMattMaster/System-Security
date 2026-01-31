"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface UsableDeviceData {
    dispositivo: number;
}

export async function getUsableDevices() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: []};
    }

    try {
        // Query per trovare dispositivi che hanno meno di 2 associazioni per l'utente corrente
        const query = `
            SELECT ada.dispositivo
            FROM appartenenze_auto aa 
            JOIN automobili a ON aa.automobile = a.targa 
            JOIN associazioni_disp_auto ada ON a.targa = ada.automobile
            WHERE aa.cliente = $1
            GROUP BY ada.dispositivo
            HAVING COUNT(*) < 2
            ORDER BY ada.dispositivo ASC
        `;
        
        const result = await pg_query<UsableDeviceData>(query, [session.user.id]);

        return {res: 1, message: "OK", data: result.rows};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero dispositivi utilizzabili:', error);
        }
        return {res: -1, message: "Errore del server", data: []};
    }
}
