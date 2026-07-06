import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-600 pt-16 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group mb-2">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-heading font-bold text-xl">
                NU
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-tight text-slate-900">
                  National Urology
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Dr. Arun Shah
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              World-class urology care in Janakpur. Specializing in advanced laser treatments, kidney stones, and prostate health.
            </p>
            <div className="flex gap-4 mt-2">
              {/* Social Links Placeholders */}
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer">
                f
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer">
                in
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-900 font-heading font-semibold text-lg mb-2">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary" /> About Doctor</Link></li>
              <li><Link href="/conditions" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary" /> Conditions</Link></li>
              <li><Link href="/treatments" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary" /> Treatments</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary" /> Patient Education</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-primary" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-900 font-heading font-semibold text-lg mb-2">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>PWJF+Q2C, Near Dashrath Pond, Janakpur 06, Dhanusha, Madhesh Province, Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+9779744427743" className="hover:text-primary transition-colors">+977 97444-27743 (Appointments/WA)</a>
                  <a href="tel:+9779814834756" className="hover:text-primary transition-colors">+977 98148-34756 (Emergency Care)</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@drarunshah.com.np" className="hover:text-primary transition-colors">info@drarunshah.com.np</a>
              </li>
            </ul>
          </div>

          {/* Clinic Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-900 font-heading font-semibold text-lg mb-2">Clinic Hours</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between items-center pb-1">
                <span className="text-slate-700 font-medium">Sunday – Saturday (Everyday)</span>
                <span className="text-slate-800 font-semibold font-mono text-sm">09:00 AM – 05:00 PM</span>
              </li>
              <li className="flex items-center gap-2 mt-1 text-emerald-600 font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                24/7 Emergency Care Available
              </li>
            </ul>
            <a 
              href="https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment." 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-3 px-5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Book via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} National Urology Center. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-slate-900 transition-colors">Medical Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
