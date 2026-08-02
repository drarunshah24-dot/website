"use client";

import React, { useState, useEffect } from "react";
import { Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment.";
const PHONE_NUMBER = "+9779744427743";

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA bar after user scrolls past 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 transform",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none",
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors border border-slate-200/80 active:scale-95"
        >
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span>Call Now</span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm active:scale-95"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Book Appointment</span>
        </a>
      </div>
    </div>
  );
}
