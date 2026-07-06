"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "flex-1 mt-[72px] overflow-x-hidden w-full" : "flex-1 w-full min-h-screen bg-slate-50"}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
