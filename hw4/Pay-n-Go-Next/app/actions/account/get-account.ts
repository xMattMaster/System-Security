"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface AccountData {
    nome: string;
    cognome: string;
    datanascita: string;
    codicefiscale: string;
    indirizzo: string;
}

export async function getAccount() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: null};
    }

    try {
        const query = "SELECT nome, cognome, datanascita, codicefiscale, indirizzo FROM clienti WHERE id = $1";
        const result = await pg_query<AccountData>(query, [session.user.id]);

        if (result.rows.length === 0) {
            return {res: -1, message: "Utente non trovato", data: null};
        }

        return {res: 1, message: "OK", data: result.rows[0]};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero dati account:', error);
        }
        return {res: -1, message: "Errore del server", data: null};
    }
}
