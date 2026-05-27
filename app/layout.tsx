import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NM Bau – Prémium Kivitelezés és Felújítás",
  description:
    "NM Bau – Prémium minőségű építőipari kivitelezés, felújítás és belső tér kialakítás igényes ügyfelek számára. Kérjen azonnali árajánlatot!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
