"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface PaymentData {
    tipopagamento: string | null;
    codicepagamento: string | null;
}

export async function getPayments() {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida", data: null};
    }

    try {
        const query = "SELECT tipopagamento, codicepagamento FROM clienti WHERE id = $1";
        const result = await pg_query<PaymentData>(query, [session.user.id]);

        if (result.rows.length === 0) {
            return {res: -1, message: "Utente non trovato", data: null};
        }

        return {res: 1, message: "OK", data: result.rows[0]};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nel recupero dati pagamento:', error);
        }
        return {res: -1, message: "Errore del server", data: null};
    }
}
