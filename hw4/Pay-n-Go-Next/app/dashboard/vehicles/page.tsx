import "server-only";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VehiclesManager } from "@/components/dashboard/vehicles-manager";
import { getVehicles } from "@/app/actions/vehicles/get-vehicles";
import { getUsableDevices } from "@/app/actions/vehicles/get-usable-devices";
import { getPayments } from "@/app/actions/payments/get-payments";

export default async function VehiclesPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const [vehiclesResult, devicesResult, paymentsResult] = await Promise.all([
        getVehicles(),
        getUsableDevices(),
        getPayments()
    ]);

    const vehicles = vehiclesResult.res === 1 ? vehiclesResult.data : [];
    const devices = devicesResult.res === 1 ? devicesResult.data : [];
    const hasPaymentMethod = paymentsResult.res === 1 && 
        !!paymentsResult.data?.tipopagamento && 
        !!paymentsResult.data?.codicepagamento;

    return <VehiclesManager 
        initialVehicles={vehicles} 
        initialDevices={devices}
        hasPaymentMethod={hasPaymentMethod}
    />;
}
