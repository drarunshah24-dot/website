"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  FileText,
  Activity,
  Stethoscope,
  HelpCircle,
  BookOpen,
  Building2,
  Settings,
  LifeBuoy,
} from "lucide-react";

export type AdminSection =
  | "blog"
  | "treatments"
  | "conditions"
  | "faq"
  | "books"
  | "gallery"
  | "settings"
  | "help";

interface AdminNavProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onSignOut: () => void;
}

export function AdminNav({
  activeSection,
  onSectionChange,
  onSignOut,
}: AdminNavProps) {
  const sections = [
    { id: "blog", icon: FileText, label: "Blog & Articles" },
    { id: "treatments", icon: Activity, label: "Treatments" },
    { id: "conditions", icon: Stethoscope, label: "Conditions" },
    { id: "faq", icon: HelpCircle, label: "FAQ" },
    { id: "books", icon: BookOpen, label: "Books & Publications" },
    { id: "gallery", icon: Building2, label: "Facilities" },
    { id: "settings", icon: Settings, label: "Homepage Settings" },
    { id: "help", icon: LifeBuoy, label: "Help & Guides" },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="container mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md">
              NU
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900">
                National Urology Center
              </h1>
              <p className="text-xs text-slate-500">
                Full Website Content & Media Manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Website
            </Link>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {sections.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeSection === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
