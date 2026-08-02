"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged cookie consent
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>Privacy & Cookie Preferences</span>
        </div>
        <button
          onClick={decline}
          className="text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        We use cookies and essential analytics to optimize your experience,
        secure the site, and improve patient services. Read our{" "}
        <Link
          href="/privacy-policy"
          className="underline text-emerald-300 hover:text-emerald-200"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={acceptAll}
          className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          Accept All
        </button>
        <button
          onClick={decline}
          className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}
