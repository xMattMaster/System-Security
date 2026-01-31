import "server-only";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountEditor } from "@/components/dashboard/account-editor";
import { getAccount } from "@/app/actions/account/get-account";
import { getKeycloakAccountUrl } from "@/app/actions/get-keycloak-account-url";
import dayjs from "dayjs";

export default async function AccountPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const result = await getAccount();
    
    if (result.res !== 1 || !result.data) {
        return (
            <div className="p-4 rounded-lg bg-red-50 text-red-800">
                Errore nel caricamento dei dati dell&apos;account
            </div>
        );
    }

    const accountData = {
        nome: result.data.nome,
        cognome: result.data.cognome,
        datanascita: dayjs(result.data.datanascita).format('YYYY-MM-DD'),
        codicefiscale: result.data.codicefiscale,
        indirizzo: result.data.indirizzo
    };

    const kcAccountUrl = await getKeycloakAccountUrl();

    return (
        <AccountEditor 
            initialData={accountData}
            userEmail={session.user.email || ""}
            kcAccountUrl={kcAccountUrl}
        />
    );
}
