import "server-only";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PaymentsEditor } from "@/components/dashboard/payments-editor";
import { getPayments } from "@/app/actions/payments/get-payments";

export default async function PaymentsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const result = await getPayments();
    
    const paymentData = {
        tipopagamento: result.data?.tipopagamento || '',
        codicepagamento: result.data?.codicepagamento || ''
    };

    return <PaymentsEditor initialData={paymentData} />;
}
