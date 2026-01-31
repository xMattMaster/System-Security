"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface AddVehicleData {
    targa: string;
    modello: string;
    dispositivo: string;
}

export async function addVehicle(data: AddVehicleData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida"};
    }

    // Validazione campi obbligatori
    if (!data.targa || !data.modello || !data.dispositivo) {
        return {res: -1, message: "Tutti i campi sono obbligatori"};
    }

    // Validazione formato targa (7 caratteri alfanumerici)
    const targaPattern = /^[A-Z0-9]{7}$/i;
    const cleanedTarga = data.targa.trim().toUpperCase();
    
    if (!targaPattern.test(cleanedTarga)) {
        return {res: -1, message: "Formato targa non valido (7 caratteri alfanumerici)"};
    }

    // Validazione lunghezza modello
    if (data.modello.trim().length > 20) {
        return {res: -1, message: "Il modello può contenere al massimo 20 caratteri"};
    }

    if (data.modello.trim().length < 2) {
        return {res: -1, message: "Il modello deve contenere almeno 2 caratteri"};
    }

    // Validazione dispositivo
    const deviceValue = data.dispositivo.trim();
    if (deviceValue !== "-1" && (isNaN(Number(deviceValue)) || Number(deviceValue) < 0)) {
        return {res: -1, message: "Dispositivo non valido"};
    }

    const cleanedData = {
        targa: cleanedTarga,
        modello: data.modello.trim(),
        dispositivo: deviceValue
    };

    try {
        // Determina il parametro option: 0 se auto-assegnazione, 1 se dispositivo specifico
        const option = deviceValue === "-1" ? 0 : 1;
        
        const query = "CALL associazione_auto($1, $2, $3, $4, $5)";
        await pg_query(query, [
            session.user.id,
            cleanedData.targa,
            cleanedData.modello,
            cleanedData.dispositivo,
            option
        ]);

        return {res: 1, message: "OK"};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nell\'aggiunta veicolo:', error);
        }
        
        // Gestione errori specifici
        if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
            return {res: -1, message: "Targa già registrata"};
        }
        
        if (error.message?.includes('check_appartenenze')) {
            return {res: -1, message: "Devi prima configurare un metodo di pagamento"};
        }
        
        if (error.message?.includes('check_dispositivi')) {
            return {res: -1, message: "Il dispositivo ha raggiunto il limite massimo di 2 veicoli"};
        }
        
        return {res: -1, message: "Errore del server"};
    }
}
