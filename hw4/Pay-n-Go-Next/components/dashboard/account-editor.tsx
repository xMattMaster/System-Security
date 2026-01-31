"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { updateAccount } from "@/app/actions/account/update-account";

interface AccountData {
    nome: string;
    cognome: string;
    datanascita: string;
    codicefiscale: string;
    indirizzo: string;
}

interface AccountEditorProps {
    initialData: AccountData;
    userEmail: string;
    kcAccountUrl: string;
}

export function AccountEditor({ initialData, userEmail, kcAccountUrl }: AccountEditorProps) {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = React.useState<AccountData>(initialData);
    const [originalFormData] = React.useState<AccountData>(initialData);

    // Prompt quando si lasciano la pagina con modifiche non salvate
    React.useEffect(() => {
        const hasChanges = isEditing && (
            formData.nome !== originalFormData.nome ||
            formData.cognome !== originalFormData.cognome ||
            formData.datanascita !== originalFormData.datanascita ||
            formData.codicefiscale !== originalFormData.codicefiscale ||
            formData.indirizzo !== originalFormData.indirizzo
        );

        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
            }
        };

        const clickHandler = (e: MouseEvent) => {
            if (hasChanges && (e.target as HTMLElement).tagName === 'A') {
                if (!window.confirm('Hai modifiche non salvate. Sei sicuro di voler lasciare questa pagina?')) {
                    e.preventDefault();
                }
            }
        };

        if (hasChanges) {
            window.addEventListener('beforeunload', beforeUnloadHandler);
            document.addEventListener('click', clickHandler, true);
        }

        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            document.removeEventListener('click', clickHandler, true);
        };
    }, [isEditing, formData, originalFormData]);

    const handleSubmit = async () => {
        setMessage(null);
        setIsPending(true);

        const result = await updateAccount(formData);

        if (result.res === 1) {
            setMessage({ type: 'success', text: 'Dati aggiornati con successo!' });
            setIsEditing(false);
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message || 'Errore nell\'aggiornamento dei dati' });
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
                <h2 className="text-3xl font-bold tracking-tight">Il tuo account</h2>
            </div>
            
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dati personali</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome</Label>
                                    <Input 
                                        id="nome" 
                                        value={formData.nome} 
                                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                        onKeyDown={handleKeyDown}
                                        disabled={!isEditing || isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cognome">Cognome</Label>
                                    <Input 
                                        id="cognome" 
                                        value={formData.cognome}
                                        onChange={(e) => setFormData({...formData, cognome: e.target.value})}
                                        onKeyDown={handleKeyDown}
                                        disabled={!isEditing || isPending}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="datanascita">Data di nascita</Label>
                                <Input 
                                    id="datanascita" 
                                    name="datanascita" 
                                    type="date"
                                    value={formData.datanascita}
                                    onChange={(e) => setFormData({...formData, datanascita: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isEditing || isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="codicefiscale">Codice fiscale</Label>
                                <Input 
                                    id="codicefiscale" 
                                    name="codicefiscale" 
                                    maxLength={16} 
                                    value={formData.codicefiscale} 
                                    onChange={(e) => setFormData({...formData, codicefiscale: e.target.value.toUpperCase()})}
                                    onKeyDown={handleKeyDown}
                                    className="uppercase" 
                                    disabled={!isEditing || isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="indirizzo">Indirizzo</Label>
                                <Input 
                                    id="indirizzo" 
                                    name="indirizzo" 
                                    maxLength={40} 
                                    value={formData.indirizzo}
                                    onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isEditing || isPending}
                                />
                            </div>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)}>
                                        Modifica dati personali
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={handleSubmit} disabled={isPending}>
                                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Aggiorna dati personali
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email (Keycloak)</Label>
                                <Input value={userEmail} disabled readOnly />
                                <p className="text-sm text-muted-foreground">
                                    Gestito tramite Keycloak
                                </p>
                                <div>
                                    <Button asChild variant="outline">
                                        <a href={kcAccountUrl} target="_blank" rel="noopener noreferrer">
                                            Vai alla gestione profilo su Keycloak
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
