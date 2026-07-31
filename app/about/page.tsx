import { generateMetadata } from "@/lib/seo";
import { buildPhysicianSchema } from "@/lib/schema";
import Script from "next/script";
import { Award, GraduationCap, Building2, Stethoscope } from "lucide-react";
import Image from "next/image";
import { getPageContent } from "@/lib/pageContent";
import { AboutData } from "@/components/admin/AboutForm";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
  title: "About Dr. Arun Shah | National Urology Center",
  description:
    "Learn about Dr. Arun Shah, Gold Medalist Urologist in Janakpur. Over a decade of experience in advanced laser surgeries and comprehensive urological care.",
  type: "profile",
});

const DEFAULT_ABOUT_DATA: AboutData = {
  hero: {
    name: "Dr. Arun Shah",
    title: "Senior Consultant Urologist",
    image: "/dr-arun-shah-urologist-janakpur.jpg",
    bioParagraphs: [
      "Dr. Arun Shah is a distinguished urologist and a Gold Medalist in M.Ch Urology. With a commitment to bringing world-class urological care to Janakpur and the Madhesh Province, he specializes in advanced, minimally invasive laser surgeries.",
      "His clinical philosophy centers around patient comfort, ethical medical practices, and utilizing the latest technological advancements to ensure faster recovery times and better outcomes.",
    ],
    stats: [
      { icon: "Award", title: "Gold Medalist", subtitle: "M.Ch Urology" },
      {
        icon: "GraduationCap",
        title: "NMC Registered",
        subtitle: "Reg No: 15706",
      },
      {
        icon: "Building2",
        title: "Years of Experience",
        subtitle: "10+ Years",
      },
    ],
    appointmentUrl:
      "https://wa.me/9779814834756?text=I%20would%20like%20to%20book%20an%20appointment.",
  },
  education: {
    sectionTitle: "Education & Qualifications",
    items: [
      {
        degree: "M.Ch in Urology",
        badgeTag: "Super-Specialization",
        highlightBadge: "University Gold Medalist",
        institution: "Institute of Medicine (IOM), Tribhuvan University",
        description:
          "Highest tier surgical super-specialization focusing on advanced endourology, reconstructive urology, renal transplantation, and minimally invasive laser surgeries (RIRS, HoLEP, PCNL). Awarded the university gold medal for first-rank academic and surgical excellence.",
      },
      {
        degree: "MS General Surgery",
        badgeTag: "Postgraduate Degree",
        highlightBadge: "Master of Surgery",
        institution: "Tribhuvan University / Reputed Medical College",
        description:
          "Comprehensive surgical residency mastery encompassing complex abdominal procedures, trauma management, intensive critical care, and surgical oncology, establishing the rigorous foundation for urological super-specialization.",
      },
      {
        degree: "MBBS",
        badgeTag: "Foundation Degree",
        highlightBadge: "Bachelor of Medicine & Surgery",
        institution: "Recognized University Medical Institute",
        description:
          "Fundamental medical and surgical degree with clinical honors, extensive patient diagnostics training, and comprehensive medical science discipline.",
      },
    ],
  },
  expertise: {
    sectionTitle: "Areas of Expertise",
    items: [
      "Laser Kidney Stone Surgery (RIRS, PCNL)",
      "Prostate Laser Surgery (HoLEP, TURP)",
      "Minimally Invasive Urology",
      "Male Infertility & Sexual Health",
      "Uro-Oncology (Kidney, Prostate, Bladder Cancer)",
      "Reconstructive Urology (Urethroplasty)",
      "Pediatric Urology",
      "Female Pelvic Medicine & Reconstructive Surgery",
    ],
  },
  philosophy: {
    sectionTitle: "Patient-Centered Medical Philosophy",
    quote:
      "My goal is to provide world-class urological care that is accessible, empathetic, and strictly ethical. I believe in empowering patients through education, ensuring they understand their conditions and treatment options fully before making decisions. Anxiety should be relieved the moment a patient walks into my clinic.",
  },
};

export default async function AboutPage() {
  const physicianSchema = buildPhysicianSchema();
  const data = await getPageContent<AboutData>("about", DEFAULT_ABOUT_DATA);

  return (
    <>
      <Script
        id="schema-physician-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />

      {/* Hero Profile */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 lg:col-span-4 flex items-center justify-center relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <Image
                src={data.hero.image || "/dr-arun-shah-urologist-janakpur.jpg"}
                alt={`${data.hero.name} - Best Urologist in Janakpur`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="md:col-span-7 lg:col-span-8">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-2">
                  {data.hero.name}
                </h1>
                <p className="text-xl text-primary font-medium">
                  {data.hero.title}
                </p>
              </div>

              <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed mb-8">
                {data.hero.bioParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 mb-8">
                {data.hero.stats.map((stat, idx) => {
                  const colors = [
                    "bg-emerald-100 text-emerald-600",
                    "bg-blue-100 text-blue-600",
                    "bg-purple-100 text-purple-600",
                  ];
                  const IconComp =
                    idx === 0 ? Award : idx === 1 ? GraduationCap : Building2;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          colors[idx % colors.length]
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {stat.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {stat.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <a
                  href={
                    data.hero.appointmentUrl ||
                    "https://wa.me/9779814834756?text=I%20would%20like%20to%20book%20an%20appointment."
                  }
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications & Specialties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2
                className="text-3xl font-heading font-bold text-slate-900 mb-8 flex items-center gap-3"
                style={{ fontVariantLigatures: "none" }}
              >
                <GraduationCap className="w-8 h-8 text-primary" />
                {data.education.sectionTitle}
              </h2>

              <div className="space-y-6">
                {data.education.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`relative group p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                      idx === 0
                        ? "bg-gradient-to-br from-white via-primary/[0.02] to-primary/[0.06] border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40"
                        : "bg-white border-slate-200/80 shadow-md hover:shadow-xl hover:border-primary/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                            idx === 0
                              ? "bg-gradient-to-br from-primary to-blue-700 text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform"
                              : "bg-slate-100 text-slate-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                          }`}
                        >
                          {idx === 0 ? (
                            <Award className="w-7 h-7" />
                          ) : idx === 1 ? (
                            <GraduationCap className="w-7 h-7" />
                          ) : (
                            <Stethoscope className="w-7 h-7" />
                          )}
                        </div>
                        <div>
                          {item.badgeTag && (
                            <span
                              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                idx === 0
                                  ? "text-primary bg-primary/10"
                                  : "text-slate-500 bg-slate-100"
                              }`}
                            >
                              {item.badgeTag}
                            </span>
                          )}
                          <h3 className="font-heading font-bold text-slate-900 text-xl sm:text-2xl mt-1.5">
                            {item.degree}
                          </h3>
                        </div>
                      </div>
                      {item.highlightBadge && (
                        <div
                          className={`inline-flex items-center self-start sm:self-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm ${
                            idx === 0
                              ? "bg-amber-50 border border-amber-200/80 text-amber-800"
                              : "bg-slate-50 border border-slate-200 text-slate-600"
                          }`}
                        >
                          {idx === 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          )}
                          {item.highlightBadge}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-800 text-base flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary shrink-0" />
                        {item.institution}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-primary" />
                {data.expertise.sectionTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.expertise.items.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-slate-700 font-medium">
                      {specialty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Stethoscope className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {data.philosophy.sectionTitle}
          </h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-90 italic">
            &quot;{data.philosophy.quote}&quot;
          </p>
        </div>
      </section>
    </>
  );
}
