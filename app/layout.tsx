import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "National Urology Center - Dr. Arun Shah",
  description:
    "World-Class Urology Care in Janakpur by Dr. Arun Shah. Advanced laser surgery and compassionate treatment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Physician",
                  name: "Dr. Arun Shah",
                  url: "https://drarunshah.com.np",
                  image:
                    "https://drarunshah.com.np/images/dr-arun-shah-urologist-janakpur.jpg",
                  jobTitle: "Consultant Urologist",
                  medicalSpecialty: "Urology",
                  sameAs: [
                    "https://www.linkedin.com/in/drarunshah",
                    "https://twitter.com/drarunshah",
                  ],
                  worksFor: {
                    "@type": "MedicalClinic",
                    name: "National Urology Center",
                    url: "https://drarunshah.com.np",
                    logo: "https://drarunshah.com.np/images/dr-arun-shah-urologist-janakpur.jpg",
                    address: {
                      "@type": "PostalAddress",
                      streetAddress: "Janakpur",
                      addressLocality: "Janakpur",
                      addressRegion: "Madhesh Province",
                      addressCountry: "NP",
                    },
                    telephone: "+9779744427743",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
        suppressHydrationWarning
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
