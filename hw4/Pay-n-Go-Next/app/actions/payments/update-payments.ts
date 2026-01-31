"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';

interface UpdatePaymentData {
    tipopagamento: string;
    codicepagamento: string;
}

export async function updatePayments(data: UpdatePaymentData) {
    const session = await auth();

    if (!session?.user?.id) {
        return {res: -1, message: "Sessione non valida"};
    }

    // Validazione campi obbligatori
    if (!data.tipopagamento || !data.codicepagamento) {
        return {res: -1, message: "Tutti i campi sono obbligatori"};
    }

    // Validazione tipo pagamento (deve essere 'Conto' o 'Carta')
    const validTypes = ['Conto', 'Carta'];
    if (!validTypes.includes(data.tipopagamento)) {
        return {res: -1, message: "Tipo di pagamento non valido. Deve essere 'Conto' o 'Carta'"};
    }

    // Validazione lunghezza codice pagamento
    if (data.codicepagamento.length > 30) {
        return {res: -1, message: "Codice pagamento troppo lungo (max 30 caratteri)"};
    }

    if (data.codicepagamento.length < 5) {
        return {res: -1, message: "Codice pagamento troppo corto"};
    }

    // Sanitizzazione input
    const cleanedData = {
        tipopagamento: data.tipopagamento.trim(),
        codicepagamento: data.codicepagamento.trim()
    };

    try {
        const query = `UPDATE clienti 
                       SET tipopagamento = $1, codicepagamento = $2 
                       WHERE id = $3`;
        
        await pg_query(query, [
            cleanedData.tipopagamento,
            cleanedData.codicepagamento,
            session.user.id
        ]);

        return {res: 1, message: "OK"};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nell\'aggiornamento metodo di pagamento:', error);
        }

        if (error.message?.includes('ck_pagamento')) {
            return {res: -1, message: "Tipo di pagamento non valido"};
        }
        
        return {res: -1, message: "Errore del server"};
    }
}
