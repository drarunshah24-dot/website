import { generateMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { getPageContent } from "@/lib/pageContent";
import { ContactData } from "@/components/admin/ContactForm";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
  title: "Contact Us | National Urology Center",
  description:
    "Get in touch with National Urology Center in Janakpur. Call us for expert urological care, appointments, and emergency care.",
});

const DEFAULT_CONTACT_DATA: ContactData = {
  hero: {
    badge: "Janakpurdham, Nepal",
    title: "Contact Us",
    description:
      "We are here to answer your questions and provide the expert urological care you need. Reach out to us via phone, email, or by visiting our clinic near Dashrath Pond in Janakpur.",
    bgImage: "/images/janaki-mandir.jpg",
  },
  location: {
    title: "Location",
    clinicName: "National Urology Center",
    addressLine1: "Near Dashrath Pond, Janakpurdham-06",
    addressLine2: "Dhanusha, Madhesh Province, Nepal",
  },
  phones: {
    title: "Phone Numbers",
    description: "Call us for appointments or emergency assistance.",
    numbers: [
      {
        label: "Appointments & WhatsApp",
        number: "+977 97444-27743",
        link: "tel:+9779744427743",
      },
      {
        label: "Emergency Care",
        number: "+977 98148-34756",
        link: "tel:+9779814834756",
      },
    ],
  },
  email: {
    title: "Email",
    description: "Send us your medical reports or general inquiries.",
    address: "drarunshah24@gmail.com",
  },
  hours: {
    title: "Opening Hours",
    days: "Sunday – Saturday (Everyday)",
    time: "09:00 AM – 05:00 PM",
    emergencyNotice: "24/7 Emergency Care Available",
  },
  appointment: {
    buttonText: "Book an Appointment Now",
    link: "https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment.",
  },
  map: {
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.38788389595!2d85.9225219!3d26.7319955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec410043ba06c5%3A0x6fcdf05f17d769a1!2sNational%20Urology%20Center!5e0!3m2!1sen!2snp!4v1718000000000!5m2!1sen!2snp",
  },
};

export default async function ContactPage() {
  const data = await getPageContent<ContactData>(
    "contact",
    DEFAULT_CONTACT_DATA,
  );

  return (
    <>
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 py-18 md:py-26 border-b border-slate-200 text-slate-900 isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={data.hero.bgImage || "/images/janaki-mandir.jpg"}
            alt="Janakpur Header Background"
            fill
            sizes="100vw"
            priority
            unoptimized
            className="object-cover object-[center_80%] opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            {data.hero.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {data.hero.badge}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              {data.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-lg">
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
                Clinic Details & Hours
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">
                        {data.location.title || "Location"}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {data.location.clinicName}
                        <br />
                        {data.location.addressLine1}
                        <br />
                        {data.location.addressLine2}
                      </p>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">
                        {data.phones.title || "Phone Numbers"}
                      </h3>
                      {data.phones.description && (
                        <p className="text-slate-600 mb-2">
                          {data.phones.description}
                        </p>
                      )}
                      <div className="flex flex-col gap-1">
                        {data.phones.numbers.map((phone, idx) => (
                          <a
                            key={idx}
                            href={phone.link}
                            className={`font-bold hover:underline ${
                              idx === 0
                                ? "text-primary text-lg"
                                : "text-slate-700 text-base hover:text-primary"
                            }`}
                          >
                            {phone.number} ({phone.label})
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">
                        {data.email.title || "Email"}
                      </h3>
                      {data.email.description && (
                        <p className="text-slate-600 mb-2">
                          {data.email.description}
                        </p>
                      )}
                      <a
                        href={`mailto:${data.email.address}`}
                        className="text-lg font-medium text-slate-700 hover:text-primary transition-colors"
                      >
                        {data.email.address}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Opening Hours & Appointment */}
                <div className="flex flex-col justify-between space-y-8 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-slate-900 text-lg mb-3">
                        {data.hours.title || "Opening Hours"}
                      </h3>
                      <div className="space-y-3 text-base">
                        <div className="flex justify-between items-center pb-1">
                          <span className="font-medium text-slate-700">
                            {data.hours.days}
                          </span>
                          <span className="text-slate-800 font-semibold font-mono text-sm sm:text-base">
                            {data.hours.time}
                          </span>
                        </div>
                      </div>
                      {data.hours.emergencyNotice && (
                        <p className="text-emerald-600 font-medium mt-4 text-sm flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          {data.hours.emergencyNotice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200/60">
                    <Button
                      size="lg"
                      asChild
                      className="rounded-full w-full py-6 text-base shadow-md hover:shadow-xl transition-all"
                    >
                      <a
                        href={data.appointment.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        {data.appointment.buttonText}
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
          src={data.map.iframeSrc}
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
