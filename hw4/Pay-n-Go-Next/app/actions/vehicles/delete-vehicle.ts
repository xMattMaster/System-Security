"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface DeleteVehicleData {
    targa: string;
}

export async function deleteVehicle(data: DeleteVehicleData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida"};
    }

    // Validazione targa
    if (!data.targa || data.targa.trim().length === 0) {
        return {res: -1, message: "Targa non valida"};
    }

    const cleanedTarga = data.targa.trim().toUpperCase();

    // Validazione formato targa
    const targaPattern = /^[A-Z0-9]{7}$/;
    if (!targaPattern.test(cleanedTarga)) {
        return {res: -1, message: "Formato targa non valido"};
    }

    try {
        // Prima verifica che l'automobile appartenga effettivamente all'utente
        const checkQuery = `
            SELECT 1 FROM appartenenze_auto 
            WHERE automobile = $1 AND cliente = $2
        `;
        const checkResult = await pg_query(checkQuery, [cleanedTarga, session.user.id]);

        if (checkResult.rows.length === 0) {
            return {res: -1, message: "Veicolo non trovato o non autorizzato"};
        }

        // Elimina l'appartenenza (il trigger eliminerà automaticamente l'auto)
        const deleteQuery = `
            DELETE FROM appartenenze_auto 
            WHERE automobile = $1 AND cliente = $2
        `;
        
        await pg_query(deleteQuery, [cleanedTarga, session.user.id]);

        return {res: 1, message: "OK"};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nell\'eliminazione veicolo:', error);
        }
        return {res: -1, message: "Errore del server"};
    }
}
