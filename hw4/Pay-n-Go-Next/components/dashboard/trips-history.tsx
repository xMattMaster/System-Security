"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getTrips } from "@/app/actions/trips/get-trips";
import dayjs from "dayjs";

interface Trip {
    id: string;
    numtragitto: number;
    dispositivo: number;
    casingresso: string;
    dataoraingresso: string;
    casuscita: string;
    dataorauscita: string;
}

export function TripsHistory() {
    const [trips, setTrips] = React.useState<Trip[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

    React.useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setIsLoading(true);
        const result = await getTrips();

        if (result.res === 1) {
            setTrips(result.data);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Storico viaggi</h2>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {trips.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">
                            Nessun viaggio registrato in questo periodo.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Ultimi Viaggi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Dispositivo</th>
                                        <th className="px-6 py-3">Casello di ingresso</th>
                                        <th className="px-6 py-3">Data/Ora di ingresso</th>
                                        <th className="px-6 py-3">Casello di uscita</th>
                                        <th className="px-6 py-3">Data/Ora di uscita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{trip.dispositivo}</td>
                                            <td className="px-6 py-4">{trip.casingresso}</td>
                                            <td className="px-6 py-4">
                                                {dayjs(trip.dataoraingresso).format('DD/MM/YYYY HH:mm')}
                                            </td>
                                            <td className="px-6 py-4">{trip.casuscita}</td>
                                            <td className="px-6 py-4">
                                                {dayjs(trip.dataorauscita).format('DD/MM/YYYY HH:mm')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
