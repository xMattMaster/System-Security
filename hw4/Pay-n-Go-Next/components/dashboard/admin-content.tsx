"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, BarChart3 } from "lucide-react";
import { addTrip } from "@/app/actions/admin/add-trip";

interface TollStat {
    casello_id: number;
    codice: string;
    numero: number;
    numero_passaggi: number;
}

interface AdminContentProps {
    initialTollStats: TollStat[];
}

export function AdminContent({ initialTollStats }: AdminContentProps) {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState(false);
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [tollStats, setTollStats] = React.useState<TollStat[]>(initialTollStats);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = React.useState({
        codiceDispositivo: '',
        codiceCaselloEntrata: '',
        numeroCaselloEntrata: '',
        codiceCaselloUscita: '',
        numeroCaselloUscita: '',
        dataOraIngresso: '',
        dataOraUscita: ''
    });

    const handleSubmit = async () => {
        setIsPending(true);
        setMessage(null);

        const result = await addTrip({
            codiceDispositivo: Number(formData.codiceDispositivo),
            codiceCaselloEntrata: formData.codiceCaselloEntrata,
            numeroCaselloEntrata: Number(formData.numeroCaselloEntrata),
            codiceCaselloUscita: formData.codiceCaselloUscita,
            numeroCaselloUscita: Number(formData.numeroCaselloUscita),
            dataOraIngresso: formData.dataOraIngresso,
            dataOraUscita: formData.dataOraUscita
        });

        if (result.res === 1) {
            setMessage({ type: 'success', text: result.message });
            setShowAddForm(false);
            setFormData({
                codiceDispositivo: '',
                codiceCaselloEntrata: '',
                numeroCaselloEntrata: '',
                codiceCaselloUscita: '',
                numeroCaselloUscita: '',
                dataOraIngresso: '',
                dataOraUscita: ''
            });
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setIsPending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isPending) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Pannello amministratore</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="mr-2 h-4 w-4" /> Registra tragitto
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Registra nuovo tragitto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="codiceDispositivo">Codice dispositivo</Label>
                                <Input
                                    id="codiceDispositivo"
                                    type="number"
                                    value={formData.codiceDispositivo}
                                    onChange={(e) => setFormData({ ...formData, codiceDispositivo: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codiceCaselloEntrata">Codice casello di ingresso</Label>
                                    <Input
                                        id="codiceCaselloEntrata"
                                        value={formData.codiceCaselloEntrata}
                                        onChange={(e) => setFormData({ ...formData, codiceCaselloEntrata: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        maxLength={20}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numeroCaselloEntrata">Numero casello di ingresso</Label>
                                    <Input
                                        id="numeroCaselloEntrata"
                                        type="number"
                                        value={formData.numeroCaselloEntrata}
                                        onChange={(e) => setFormData({ ...formData, numeroCaselloEntrata: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codiceCaselloUscita">Codice casello di uscita</Label>
                                    <Input
                                        id="codiceCaselloUscita"
                                        value={formData.codiceCaselloUscita}
                                        onChange={(e) => setFormData({ ...formData, codiceCaselloUscita: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        maxLength={20}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numeroCaselloUscita">Numero casello di uscita</Label>
                                    <Input
                                        id="numeroCaselloUscita"
                                        type="number"
                                        value={formData.numeroCaselloUscita}
                                        onChange={(e) => setFormData({ ...formData, numeroCaselloUscita: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dataOraIngresso">Data/Ora di ingresso</Label>
                                    <Input
                                        id="dataOraIngresso"
                                        type="datetime-local"
                                        value={formData.dataOraIngresso}
                                        onChange={(e) => setFormData({ ...formData, dataOraIngresso: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dataOraUscita">Data/Ora di uscita</Label>
                                    <Input
                                        id="dataOraUscita"
                                        type="datetime-local"
                                        value={formData.dataOraUscita}
                                        onChange={(e) => setFormData({ ...formData, dataOraUscita: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSubmit} disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Registra
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setFormData({
                                            codiceDispositivo: '',
                                            codiceCaselloEntrata: '',
                                            numeroCaselloEntrata: '',
                                            codiceCaselloUscita: '',
                                            numeroCaselloUscita: '',
                                            dataOraIngresso: '',
                                            dataOraUscita: ''
                                        });
                                        setMessage(null);
                                    }}
                                    disabled={isPending}
                                >
                                    Annulla
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Statistiche caselli</CardTitle>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    {tollStats.length === 0 ? (
                        <p className="text-center text-muted-foreground">Nessun dato disponibile</p>
                    ) : (
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Posizione</th>
                                        <th className="px-6 py-3">Codice</th>
                                        <th className="px-6 py-3">Numero</th>
                                        <th className="px-6 py-3">Passaggi totali</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tollStats.map((stat, index) => (
                                        <tr key={stat.casello_id} className={`border-b ${index === 0 ? 'bg-yellow-50' : 'bg-white'} hover:bg-gray-50`}>
                                            <td className="px-6 py-4 font-medium">
                                                {index === 0 && '🏆 '}#{index + 1}
                                            </td>
                                            <td className="px-6 py-4">{stat.codice}</td>
                                            <td className="px-6 py-4">{stat.numero}</td>
                                            <td className="px-6 py-4 font-bold">{stat.numero_passaggi}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
