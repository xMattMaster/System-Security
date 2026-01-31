"use client"

import * as React from "react"
import {useRouter} from "next/navigation"
import dayjs from "dayjs"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {completeRegistration} from "@/app/actions/complete-registration"

interface User {
    id?: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
}

interface CompleteRegistrationProps {
    user: User
}

export default function CompleteRegistration({user}: CompleteRegistrationProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [formData, setFormData] = React.useState({
        dateOfBirth: "",
        cfId: "",
        address: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const validate = () => {
        if (!formData.dateOfBirth) return "La data di nascita è obbligatoria"
        if (!formData.cfId) return "Il codice fiscale è obbligatorio"
        formData.cfId = formData.cfId.toUpperCase()
        if (!formData.address) return "L'indirizzo è obbligatorio"

        const birthDate = dayjs(formData.dateOfBirth)
        const eighteenYearsAgo = dayjs().subtract(18, 'year')

        if (!birthDate.isValid()) return "Data di nascita non valida"
        if (birthDate.isAfter(eighteenYearsAgo)) return "Devi essere maggiorenne"

        if (formData.cfId.length !== 16) return "Il codice fiscale deve essere di 16 caratteri"
        if (formData.address.length > 40) return "L'indirizzo può contenere al massimo 40 caratteri"

        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }
        setIsLoading(true)

        try {
            const result = await completeRegistration(formData)

            if (result.res === 0) {
                router.refresh()
            } else {
                setError(result.message || "Errore durante la registrazione")
            }
        } catch (err) {
            setError("Errore di connessione al server")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Completa il tuo profilo</CardTitle>
                <CardDescription>
                    Inserisci i dati mancanti per completare la registrazione.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input id="firstName" value={user.firstName || ""} disabled readOnly className="bg-muted"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Cognome</Label>
                            <Input id="lastName" value={user.lastName || ""} disabled readOnly className="bg-muted"/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Data di nascita</Label>
                        <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cfId">Codice Fiscale</Label>
                        <Input
                            id="cfId"
                            name="cfId"
                            required
                            maxLength={16}
                            value={formData.cfId}
                            onChange={handleChange}
                            className="uppercase"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Indirizzo</Label>
                        <Input
                            id="address"
                            name="address"
                            required
                            maxLength={40}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Salvataggio..." : "Completa registrazione"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
