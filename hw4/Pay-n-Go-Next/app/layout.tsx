import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "@/components/providers";
import {Navbar} from "@/components/navbar";
import {Footer} from "@/components/footer";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Pay n' Go Next",
    description: "On your way to success",
};

export default async function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const nonce = (await headers()).get('x-nonce');

    return (
        <html lang="it" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-grow">{children}</main>
                <Footer/>
            </div>
        </Providers>
        </body>
        </html>
    );
}
