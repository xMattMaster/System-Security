"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface VehicleData {
    targa: string;
    modello: string;
    dispositivo: number;
}

export async function getVehicles() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: []};
    }

    try {
        const query = `
            SELECT a.targa, a.modello, ada.dispositivo
            FROM appartenenze_auto aa 
            JOIN automobili a ON aa.automobile = a.targa 
            JOIN associazioni_disp_auto ada ON a.targa = ada.automobile
            WHERE aa.cliente = $1
            ORDER BY a.targa ASC
        `;
        
        const result = await pg_query<VehicleData>(query, [session.user.id]);

        return {res: 1, message: "OK", data: result.rows};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero veicoli:', error);
        }
        return {res: -1, message: "Errore del server", data: []};
    }
}
