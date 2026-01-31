"use client"

import * as React from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2} from "lucide-react";
import {updatePayments} from "@/app/actions/payments/update-payments";

interface PaymentData {
    tipopagamento: string;
    codicepagamento: string;
}

interface PaymentsEditorProps {
    initialData: PaymentData;
}

export function PaymentsEditor({initialData}: PaymentsEditorProps) {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = React.useState<PaymentData>(initialData);
    const [originalFormData] = React.useState<PaymentData>(initialData);

    const hasPaymentMethod = initialData.tipopagamento && initialData.codicepagamento;

    const handleSubmit = async () => {
        setMessage(null);
        setIsPending(true);

        const result = await updatePayments(formData);

        if (result.res === 1) {
            setMessage({type: 'success', text: 'Metodo di pagamento aggiornato con successo!'});
            setIsEditing(false);
            router.refresh();
        } else {
            setMessage({type: 'error', text: result.message || 'Errore nell\'aggiornamento del metodo di pagamento'});
        }

        setIsPending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isEditing && !isPending) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Metodi di pagamento</h2>
            </div>

            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informazioni di pagamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tipopagamento">Tipo di pagamento</Label>
                            <select
                                id="tipopagamento"
                                value={formData.tipopagamento}
                                onChange={(e) => setFormData({...formData, tipopagamento: e.target.value})}
                                className="w-full p-2 border rounded-md"
                                disabled={!isEditing || isPending}
                                required
                            >
                                <option value="">Seleziona...</option>
                                <option value="Conto">Conto Corrente</option>
                                <option value="Carta">Carta di Credito</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codicepagamento">
                                {formData.tipopagamento === 'Conto' ? 'IBAN' : 'Numero carta'}
                            </Label>
                            <Input
                                id="codicepagamento"
                                value={formData.codicepagamento}
                                onChange={(e) => setFormData({...formData, codicepagamento: e.target.value})}
                                onKeyDown={handleKeyDown}
                                maxLength={30}
                                placeholder={formData.tipopagamento === 'Conto' ? 'IT60X0542811101000000123456' : '1234 5678 9012 3456'}
                                disabled={!isEditing || isPending}
                            />
                        </div>
                        <div className="flex gap-2">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    {hasPaymentMethod ? 'Modifica' : 'Aggiungi'} metodo di pagamento
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleSubmit} disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Salva
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setFormData(originalFormData);
                                            setIsEditing(false);
                                            setMessage(null);
                                        }}
                                        disabled={isPending}
                                    >
                                        Annulla
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
