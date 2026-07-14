/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/useScroll";
import { Button } from "@/components/ui/button";
import { Menu, Phone, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment.";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Conditions", href: "/conditions" },
  { name: "Treatments", href: "/treatments" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const isScrolled = useScroll(20);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border shadow-sm py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-heading font-bold text-xl transition-transform group-hover:scale-105">
            NU
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg leading-tight text-foreground">
              National Urology
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Dr. Arun Shah
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm transition-colors relative",
                isActive(link.href)
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 font-medium hover:text-blue-600",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <a href="tel:+9779744427743">
              <Phone className="w-4 h-4" />
              +977 97444-27743
            </a>
          </Button>
          <Button asChild className="rounded-full px-6 font-semibold shadow-sm">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Book Appointment
            </a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg flex flex-col p-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "py-3 px-4 text-base rounded-md",
                isActive(link.href)
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-slate-600 font-medium hover:bg-slate-50 hover:text-blue-600",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 px-4">
            <Button
              variant="outline"
              asChild
              className="w-full justify-center gap-2"
            >
              <a href="tel:+9779744427743">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </Button>
            <Button className="w-full justify-center" asChild>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Appointment
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
