import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMetadata } from "@/lib/seo";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Droplets,
  HeartPulse,
  UserRound,
  BookOpen,
  Camera,
} from "lucide-react";
import Script from "next/script";
import { buildMedicalClinicSchema, buildPhysicianSchema } from "@/lib/schema";
import { getAllMdx } from "@/lib/mdx";
import { FaqSection } from "@/components/sections/FaqSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroGlow } from "@/components/ui/HeroGlow";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ClinicMarquee } from "@/components/ui/ClinicMarquee";

import fs from "fs";
import path from "path";
import { getCloudEnv } from "@/lib/env";

const WHATSAPP_URL =
  "https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment.";
const PHONE_NUMBER = "+9779744427743";

export const revalidate = 3600;
export const metadata = generateMetadata({
  title: "National Urology Center - Dr. Arun Shah | Janakpur",
  description:
    "World-Class Urology Care in Janakpur by Dr. Arun Shah. Specializing in advanced laser surgery, kidney stones, and prostate health.",
});

interface BookFrontmatter {
  title: string;
  cover: string;
  description: string;
  date: string;
}

interface GalleryFrontmatter {
  title: string;
  image: string;
}

interface FaqFrontmatter {
  title: string;
  category?: string;
}

export default async function Home() {
  const clinicSchema = buildMedicalClinicSchema();
  const physicianSchema = buildPhysicianSchema();
  const books = await getAllMdx<BookFrontmatter>("books");
  const galleryRaw = await getAllMdx<GalleryFrontmatter>("gallery");
  const galleryItems = galleryRaw.map((g) => ({
    title: g.frontmatter.title || "Facility Photo",
    image: g.frontmatter.image || "",
  }));
  const faqs = await getAllMdx<FaqFrontmatter>("faq");

  let heroPhoto = "/dr-arun-shah-urologist-janakpur.jpg";
  let doctorName = "Dr. Arun Shah";
  let subtitle = "Senior Urologist & Gold Medalist";

  try {
    const settingsPath = path.join(process.cwd(), "content", "settings.json");
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      if (settings.heroDoctorPhoto) {
        heroPhoto = settings.heroDoctorPhoto;
      }
      if (settings.doctorName) {
        doctorName = settings.doctorName;
      }
      if (settings.subtitle) {
        subtitle = settings.subtitle;
      }
    }
  } catch {
    // fallback
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <Script
        id="schema-clinic"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />
      <Script
        id="schema-physician"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative isolate overflow-hidden bg-slate-50 pt-20 pb-24 lg:pt-36 lg:pb-44">
        <HeroGlow />

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Content */}
            <div className="flex flex-col justify-center space-y-8 max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-blue-700 mr-2 animate-pulse"></span>
                Accepting New Patients in Janakpur
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1]">
                  World-Class Urology Care in{" "}
                  <span className="text-primary">Janakpur</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                  {subtitle} by{" "}
                  <span className="font-semibold text-slate-800">
                    {doctorName}
                  </span>
                  . Experience premium healthcare with modern technology.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-slate-100">
                  <Award className="w-4 h-4 text-yellow-500" />
                  M.Ch Urology
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-slate-100">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Gold Medalist
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  NMC: 15706
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 items-start">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-3 px-5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Book Appointment</span>
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm py-3 px-5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Social Proof Badge */}
              <div className="mt-8 flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md border border-slate-100 w-fit">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    <AnimatedCounter end={2600} suffix="+" />
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    Patients Treated
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor Image */}
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl shadow-xl z-10 overflow-hidden">
              <Image
                src={heroPhoto}
                alt={`${doctorName} - Best Urologist in Janakpur`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED SERVICES SECTION ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                Advanced Urological Treatments
              </h2>
              <p className="text-lg text-slate-600">
                We provide state-of-the-art diagnostic and surgical solutions
                for all urological conditions using minimally invasive
                techniques.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Kidney Stones — Droplets icon */}
            <Link href="/conditions/kidney-stones" className="block h-full">
              <Card className="h-full border-slate-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 group cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <CardTitle>Kidney Stones (Patthari)</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Advanced laser surgery for kidney stones without large
                    incisions, ensuring faster recovery.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:underline">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Card 2: Prostate — ShieldCheck icon */}
            <Link
              href="/conditions/prostate-enlargement"
              className="block h-full"
            >
              <Card className="h-full border-slate-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 group cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <CardTitle>Prostate Enlargement (Pesab ko samasya)</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Minimally invasive laser treatments (HoLEP/TURP) for
                    enlarged prostate and urinary issues.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:underline">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Card 3: Male Sexual Health — UserRound icon */}
            <Link
              href="/conditions/male-sexual-health"
              className="block h-full"
            >
              <Card className="h-full border-slate-100 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 group cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <UserRound className="w-6 h-6" />
                  </div>
                  <CardTitle>Male Sexual Health</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Confidential and expert care for erectile dysfunction, male
                    infertility, and related conditions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:underline">
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full"
            >
              <Link href="/treatments">View All Treatments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── AUTHORITY BLOCK: Publications ─── */}
      {books.length > 0 && (
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-primary text-sm font-semibold rounded-full border border-primary/20 mb-6">
                <BookOpen className="w-4 h-4" />
                Published Author
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                Publications by Dr. Arun Shah
              </h2>
              <p className="text-lg text-slate-600">
                Dr. Shah is a recognized authority in urology, contributing to
                medical literature and advancing surgical knowledge.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {books.map((book) => (
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="block h-full"
                >
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col cursor-pointer">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-8 overflow-hidden">
                      <Image
                        src={
                          book.frontmatter.cover ||
                          "https://placehold.co/400x600/e2e8f0/475569?text=Book+Cover"
                        }
                        alt={book.frontmatter.title || "Book Cover"}
                        width={400}
                        height={600}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">
                          {book.frontmatter.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {book.frontmatter.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 text-primary font-medium text-sm flex items-center gap-2 group-hover:underline">
                        Read publication{" "}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CLINIC GALLERY: State-of-the-Art Facilities (Infinite Marquee) ─── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100 mb-4">
            <Camera className="w-4 h-4" />
            Clinic Tour
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            State-of-the-Art Facilities
          </h2>
          <p className="text-lg text-slate-600">
            Our clinic is equipped with the latest urological technology in a
            clean, comfortable, and modern environment.
          </p>
        </div>

        {/* The Infinite Scrolling Marquee */}
        <ClinicMarquee initialItems={galleryItems} />
      </section>

      {/* ─── FAQ SECTION ─── */}
      <FaqSection faqs={faqs} />

      {/* ─── EMERGENCY / TRUST SECTION ─── (Light theme, no dark Frankenstein) */}
      <section className="py-20 bg-blue-50 border-y border-blue-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">
                Need Immediate Care?
              </h2>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Urological emergencies like severe kidney stone pain, urine
                retention, or blood in urine require prompt attention. We offer
                24/7 emergency support to ensure you get the help you need when
                it matters most.
              </p>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                  </span>
                  <span className="text-sm font-bold tracking-wider uppercase text-red-600">
                    24/7 Active Emergency Helpline
                  </span>
                </div>
                <a
                  href="tel:+9779814834756"
                  className="text-4xl md:text-5xl font-black text-blue-600 hover:text-blue-700 transition-colors tracking-tight w-fit py-2 block"
                >
                  +977 98148-34756
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <Clock className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    24/7 Availability
                  </h3>
                  <p className="text-sm text-slate-600">
                    Round-the-clock emergency urological care.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Expert Team
                  </h3>
                  <p className="text-sm text-slate-600">
                    Led by Gold Medalist Dr. Arun Shah.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM BOOKING CTA ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Ready to Take Control of Your Urological Health?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Schedule your one-on-one consultation with Gold Medalist Dr. Arun
              Shah today without any hassle.
            </p>
            <div className="flex justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3.5 px-7 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2.5"
              >
                <svg
                  className="w-5 h-5 fill-current shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Book Appointment via WhatsApp</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
