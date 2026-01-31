"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';
import {requireAdmin} from "@/lib/admin";
import dayjs from "dayjs";

interface AddTripData {
    codiceDispositivo: number;
    codiceCaselloEntrata: string;
    numeroCaselloEntrata: number;
    codiceCaselloUscita: string;
    numeroCaselloUscita: number;
    dataOraIngresso: string;
    dataOraUscita: string;
}

export async function addTrip(data: AddTripData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida"};
    }

    // Verifica permessi amministratore
    try {
        await requireAdmin();
    } catch (error) {
        return {res: -1, message: "Accesso negato: privilegi di amministratore richiesti"};
    }

    // Validazione campi obbligatori
    if (!data.codiceDispositivo || !data.codiceCaselloEntrata || !data.numeroCaselloEntrata ||
        !data.codiceCaselloUscita || !data.numeroCaselloUscita || !data.dataOraIngresso || !data.dataOraUscita) {
        return {res: -1, message: "Tutti i campi sono obbligatori"};
    }

    // Validazione dispositivo
    if (isNaN(Number(data.codiceDispositivo)) || data.codiceDispositivo < 0) {
        return {res: -1, message: "Codice dispositivo non valido"};
    }

    // Validazione numeri casello
    if (isNaN(Number(data.numeroCaselloEntrata)) || data.numeroCaselloEntrata < 0) {
        return {res: -1, message: "Numero casello di entrata non valido"};
    }

    if (isNaN(Number(data.numeroCaselloUscita)) || data.numeroCaselloUscita < 0) {
        return {res: -1, message: "Numero casello di uscita non valido"};
    }

    // Validazione codici casello
    if (data.codiceCaselloEntrata.trim().length > 20) {
        return {res: -1, message: "Codice casello di entrata troppo lungo (max 20 caratteri)"};
    }

    if (data.codiceCaselloUscita.trim().length > 20) {
        return {res: -1, message: "Codice casello di uscita troppo lungo (max 20 caratteri)"};
    }

    // Validazione date/ore
    const dataIngresso = dayjs(data.dataOraIngresso);
    const dataUscita = dayjs(data.dataOraUscita);

    if (!dataIngresso.isValid()) {
        return {res: -1, message: "Data/ora di ingresso non valida"};
    }

    if (!dataUscita.isValid()) {
        return {res: -1, message: "Data/ora di uscita non valida"};
    }

    if (dataUscita.isBefore(dataIngresso)) {
        return {res: -1, message: "La data di uscita deve essere successiva alla data di ingresso"};
    }

    if (dataIngresso.isAfter(dayjs())) {
        return {res: -1, message: "La data di ingresso non può essere nel futuro"};
    }

    const cleanedData = {
        codiceDispositivo: Number(data.codiceDispositivo),
        codiceCaselloEntrata: data.codiceCaselloEntrata.trim(),
        numeroCaselloEntrata: Number(data.numeroCaselloEntrata),
        codiceCaselloUscita: data.codiceCaselloUscita.trim(),
        numeroCaselloUscita: Number(data.numeroCaselloUscita),
        dataOraIngresso: data.dataOraIngresso,
        dataOraUscita: data.dataOraUscita
    };

    try {
        const query = "CALL registrazione_tragitti($1, $2, $3, $4, $5, $6, $7)";
        await pg_query(query, [
            cleanedData.codiceDispositivo,
            cleanedData.codiceCaselloEntrata,
            cleanedData.numeroCaselloEntrata,
            cleanedData.codiceCaselloUscita,
            cleanedData.numeroCaselloUscita,
            cleanedData.dataOraIngresso,
            cleanedData.dataOraUscita
        ]);

        return {res: 1, message: "Tragitto registrato con successo"};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nella registrazione del tragitto:', error);
        }
        
        // Gestione errori specifici
        if (error.message?.includes('foreign key') || error.message?.includes('not found')) {
            return {res: -1, message: "Dispositivo o casello non trovato"};
        }
        
        return {res: -1, message: "Errore del server"};
    }
}
