"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { addVehicle } from "@/app/actions/vehicles/add-vehicle";
import { deleteVehicle } from "@/app/actions/vehicles/delete-vehicle";

interface Vehicle {
    targa: string;
    modello: string;
    dispositivo: number;
}

interface UsableDevice {
    dispositivo: number;
}

interface VehiclesManagerProps {
    initialVehicles: Vehicle[];
    initialDevices: UsableDevice[];
    hasPaymentMethod: boolean;
}

export function VehiclesManager({ initialVehicles, initialDevices, hasPaymentMethod }: VehiclesManagerProps) {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState(false);
    const [vehicles, setVehicles] = React.useState<Vehicle[]>(initialVehicles);
    const [usableDevices] = React.useState<UsableDevice[]>(initialDevices);
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = React.useState({
        targa: '',
        modello: '',
        dispositivo: '-1'
    });

    const handleAddVehicle = async () => {
        setMessage(null);
        setIsPending(true);

        const result = await addVehicle(formData);

        if (result.res === 1) {
            setMessage({ type: 'success', text: 'Veicolo aggiunto con successo!' });
            setShowAddForm(false);
            setFormData({ targa: '', modello: '', dispositivo: '-1' });
            setVehicles([...vehicles, {
                targa: formData.targa,
                modello: formData.modello,
                dispositivo: formData.dispositivo === '-1' ? 1 : parseInt(formData.dispositivo)
            }]);
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        
        setIsPending(false);
    };

    const handleDeleteVehicle = async (targa: string) => {
        if (!confirm(`Sei sicuro di voler eliminare il veicolo ${targa}?`)) {
            return;
        }

        setMessage(null);
        setIsPending(true);

        const result = await deleteVehicle({ targa });

        if (result.res === 1) {
            setMessage({ type: 'success', text: 'Veicolo eliminato con successo!' });
            setVehicles(vehicles.filter(v => v.targa !== targa));
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        
        setIsPending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isPending) {
            e.preventDefault();
            handleAddVehicle();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">I tuoi veicoli</h2>
                <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    disabled={!hasPaymentMethod}
                >
                    <Plus className="mr-2 h-4 w-4" /> Aggiungi veicolo
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {!hasPaymentMethod && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-6">
                        <p className="text-yellow-800 mb-4">
                            ⚠️ Devi configurare un metodo di pagamento prima di poter registrare veicoli.
                        </p>
                        <Button asChild>
                            <a href="/dashboard/payments">
                                Vai ai metodi di pagamento
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Aggiungi nuovo veicolo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="targa">Targa</Label>
                                    <Input
                                        id="targa"
                                        value={formData.targa}
                                        onChange={(e) => setFormData({ ...formData, targa: e.target.value.toUpperCase() })}
                                        onKeyDown={handleKeyDown}
                                        maxLength={7}
                                        placeholder="AB123CD"
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modello">Modello</Label>
                                    <Input
                                        id="modello"
                                        value={formData.modello}
                                        onChange={(e) => setFormData({ ...formData, modello: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        maxLength={20}
                                        placeholder="Fiat Panda"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dispositivo">Dispositivo</Label>
                                <select
                                    id="dispositivo"
                                    value={formData.dispositivo}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, dispositivo: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    disabled={isPending}
                                >
                                    <option value="-1">Assegna automaticamente</option>
                                    {usableDevices.map((device) => (
                                        <option key={device.dispositivo} value={device.dispositivo}>
                                            Dispositivo {device.dispositivo}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-muted-foreground">
                                    Seleziona un dispositivo o lascia l&apos;assegnazione automatica
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleAddVehicle} disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Aggiungi
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setFormData({ targa: '', modello: '', dispositivo: '-1' });
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

            {isPending && vehicles.length === 0 ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : vehicles.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">
                            Nessun veicolo registrato. Aggiungi il tuo primo veicolo!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.targa}>
                            <CardHeader>
                                <CardTitle>{vehicle.modello}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Targa:</span>
                                        <span className="font-medium">{vehicle.targa}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Dispositivo:</span>
                                        <span className="font-medium">{vehicle.dispositivo}</span>
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => handleDeleteVehicle(vehicle.targa)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Elimina
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
