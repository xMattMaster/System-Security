import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getAllTollStats } from "@/app/actions/admin/get-toll-stats";
import { AdminContent } from "@/components/dashboard/admin-content";

export default async function AdminPage() {
    const admin = await isAdmin();
    if (!admin) {
        redirect('/dashboard');
    }

    const statsResult = await getAllTollStats();
    const tollStats = statsResult.res === 1 ? statsResult.data : [];

    return <AdminContent initialTollStats={tollStats} />;
}
