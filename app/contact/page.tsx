import { generateMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Contact Us | National Urology Center",
  description: "Get in touch with National Urology Center in Janakpur. Call us at +977 9814834756 or visit our clinic near Dashrath Pond for expert urological care.",
});

export default function ContactPage() {
  return (
    <>
      {/* Header with Janaki Mandir Background */}
      {/* Header with Janaki Mandir Background (Warm Light Aesthetic) */}
      <section className="relative overflow-hidden bg-slate-50 py-18 md:py-26 border-b border-slate-200 text-slate-900 isolate">
        {/* Janaki Mandir Background Image without Dark Navy Blue Shroud */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/janaki-mandir.jpg"
            alt="Janaki Mandir Janakpur"
            className="w-full h-full object-cover object-[center_80%] opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
          />
          {/* Soft Warm White Gradient Overlay for Text Readability & Light Premium Aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Janakpurdham, Nepal
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              We are here to answer your questions and provide the expert urological care you need. Reach out to us via phone, email, or by visiting our clinic near Dashrath Pond in Janakpur.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Contact Information */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-lg">
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Clinic Details & Hours</h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">Location</h3>
                      <p className="text-slate-600 leading-relaxed">
                        National Urology Center<br />
                        Near Dashrath Pond, Janakpurdham-06<br />
                        Dhanusha, Madhesh Province, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">Phone Numbers</h3>
                      <p className="text-slate-600 mb-2">Call us for appointments or emergency assistance.</p>
                      <div className="flex flex-col gap-1">
                        <a href="tel:+9779744427743" className="text-primary font-bold text-lg hover:underline">
                          +977 97444-27743 (Appointments & WhatsApp)
                        </a>
                        <a href="tel:+9779814834756" className="text-slate-700 font-semibold text-base hover:text-primary hover:underline">
                          +977 98148-34756 (Emergency Care)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">Email</h3>
                      <p className="text-slate-600 mb-2">Send us your medical reports or general inquiries.</p>
                      <a href="mailto:info@drarunshah.com.np" className="text-primary font-medium hover:underline">
                        info@drarunshah.com.np
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-8 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-slate-900 text-lg mb-3">Opening Hours</h3>
                      <div className="space-y-3 text-base">
                        <div className="flex justify-between items-center pb-1">
                          <span className="font-medium text-slate-700">Sunday – Saturday (Everyday)</span>
                          <span className="text-slate-800 font-semibold font-mono text-sm sm:text-base">09:00 AM – 05:00 PM</span>
                        </div>
                      </div>
                      <p className="text-emerald-600 font-medium mt-4 text-sm flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        24/7 Emergency Care Available
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200/60">
                    <Button size="lg" asChild className="rounded-full w-full py-6 text-base shadow-md hover:shadow-xl transition-all">
                      <a href="https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener noreferrer">
                        <Calendar className="w-5 h-5 mr-2" />
                        Book an Appointment Now
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full bg-slate-100 relative border-t border-slate-200">
        <iframe
          title="National Urology Center Janakpur Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.498188177309!2d85.9224853!3d26.7317789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec3f7e00000001%3A0x0!2zMjbCsDQzJzU0LjQiTiA4NcKwNTUnMjAuOSJF!5e0!3m2!1sen!2snp!4v1718000000000!5m2!1sen!2snp"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </section>
    </>
  );
}
