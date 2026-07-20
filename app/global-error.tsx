"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold font-heading mb-4 text-slate-900">
              Something went wrong!
            </h1>

            <p className="text-slate-600 mb-8 leading-relaxed">
              We&apos;ve encountered an unexpected error. Our technical team has
              been notified.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => reset()}
                className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
                size="lg"
              >
                <RotateCcw className="w-4 h-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
