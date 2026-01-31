"use server"

import "server-only"
import {auth} from "@/lib/auth";
import pg_query from '@/lib/pgpool';
import dayjs from "dayjs";


interface RegistrationData {
    dateOfBirth: string
    cfId: string
    address: string
}

export async function completeRegistration(data: RegistrationData) {
    const session = await auth();

    if (!session?.user?.email || !session.user.firstName || !session.user.lastName) {
        return {res: -1, message: "Sessione non valida"}
    }

    if (!data.dateOfBirth || !data.cfId || !data.address) {
        return {res: -1, message: "Tutti i campi sono obbligatori"};
    }

    // Validazione formato codice fiscale italiano
    const cfPattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
    if (data.cfId.length !== 16 || !cfPattern.test(data.cfId.toUpperCase())) {
        return {res: -1, message: "Formato codice fiscale non valido"}
    }

    const birthDate = dayjs(data.dateOfBirth)
    const eighteenYearsAgo = dayjs().subtract(18, "year")

    if (!birthDate.isValid()) {
        return {res: -1, message: "Data di nascita non valida"}
    }

    if (birthDate.isAfter(eighteenYearsAgo)) {
        return {res: -1, message: "Devi essere maggiorenne"}
    }

    if (data.address.length > 40) {
        return {res: -1, message: "L'indirizzo può contenere al massimo 40 caratteri"};
    }

    try {
        const query = "CALL completa_registrazione($1, $2, $3, $4, $5, $6)";
        const result = await pg_query(query, [
            session.user.id,
            session.user.firstName,
            session.user.lastName,
            data.dateOfBirth,
            data.cfId,
            data.address
        ]);

        return {res: 0, message: "OK"};

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Errore nella registrazione:', error);
        }
        return {res: -1, message: "Errore del server"};
    }
}