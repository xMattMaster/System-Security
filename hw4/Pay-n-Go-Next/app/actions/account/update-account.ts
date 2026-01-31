"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';
import dayjs from "dayjs";

interface UpdateAccountData {
    nome: string;
    cognome: string;
    datanascita: string;
    codicefiscale: string;
    indirizzo: string;
}

export async function updateAccount(data: UpdateAccountData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida"};
    }

    // Validazione campi obbligatori
    if (!data.nome || !data.cognome || !data.datanascita || !data.codicefiscale || !data.indirizzo) {
        return {res: -1, message: "Tutti i campi sono obbligatori"};
    }

    // Validazione lunghezze
    if (data.nome.trim().length === 0 || data.nome.length > 255) {
        return {res: -1, message: "Nome non valido (max 255 caratteri)"};
    }

    if (data.cognome.trim().length === 0 || data.cognome.length > 255) {
        return {res: -1, message: "Cognome non valido (max 255 caratteri)"};
    }

    // Validazione formato codice fiscale italiano
    const cfPattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
    if (data.codicefiscale.length !== 16 || !cfPattern.test(data.codicefiscale.toUpperCase())) {
        return {res: -1, message: "Formato codice fiscale non valido"};
    }

    if (data.indirizzo.trim().length === 0 || data.indirizzo.length > 40) {
        return {res: -1, message: "Indirizzo non valido (max 40 caratteri)"};
    }

    // Validazione data di nascita
    const birthDate = dayjs(data.datanascita);
    const eighteenYearsAgo = dayjs().subtract(18, "years");

    if (!birthDate.isValid()) {
        return {res: -1, message: "Data di nascita non valida"};
    }

    if (birthDate.isAfter(eighteenYearsAgo)) {
        return {res: -1, message: "Devi essere maggiorenne"};
    }

    // Sanitizzazione input
    const cleanedData = {
        nome: data.nome.trim(),
        cognome: data.cognome.trim(),
        datanascita: data.datanascita,
        codicefiscale: data.codicefiscale.trim().toUpperCase(),
        indirizzo: data.indirizzo.trim()
    };

    try {
        const query = `UPDATE clienti 
                       SET nome = $1, cognome = $2, datanascita = $3, codicefiscale = $4, indirizzo = $5 
                       WHERE id = $6`;
        
        await pg_query(query, [
            cleanedData.nome,
            cleanedData.cognome,
            cleanedData.datanascita,
            cleanedData.codicefiscale,
            cleanedData.indirizzo,
            session.user.id
        ]);

        return {res: 1, message: "OK"};

    } catch (error: any) {
        // Logging sicuro - dettagli solo in sviluppo
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nell\'aggiornamento account:', error);
        }
        
        // Gestione errore codice fiscale duplicato
        if (error.message?.includes('ck_codicefiscale_unique')) {
            return {res: -1, message: "Codice fiscale già registrato"};
        }
        
        return {res: -1, message: "Errore del server"};
    }
}
