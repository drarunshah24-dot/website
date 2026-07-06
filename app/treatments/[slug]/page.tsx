import { getMdxBySlug, getAllMdx } from "@/lib/mdx";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Phone, ArrowLeft, ShieldCheck } from "lucide-react";

interface TreatmentFrontmatter {
  title: string;
  description: string;
  image?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const treatment = getMdxBySlug<TreatmentFrontmatter>("treatments", resolvedParams.slug);
  
  if (!treatment) {
    return { title: "Treatment Not Found" };
  }

  return generateSeoMetadata({
    title: `${treatment.frontmatter.title} | National Urology Center`,
    description: treatment.frontmatter.description,
    url: `/treatments/${resolvedParams.slug}`,
    image: treatment.frontmatter.image,
    type: "article",
  });
}

export async function generateStaticParams() {
  const treatments = getAllMdx<TreatmentFrontmatter>("treatments");
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

export default async function TreatmentPage({ params }: Props) {
  const resolvedParams = await params;
  const treatment = getMdxBySlug<TreatmentFrontmatter>("treatments", resolvedParams.slug);

  if (!treatment) {
    notFound();
  }

  return (
    <>
      <div className="bg-emerald-50 py-12 border-b border-emerald-100">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/treatments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all treatments
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200 mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Advanced Procedure
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              {treatment.frontmatter.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl">
              {treatment.frontmatter.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-a:text-emerald-700 prose-li:marker:text-emerald-500">
              <MDXRemote source={treatment.content} />
            </article>

            <div className="mt-16 p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-slate-900 shadow-sm">
              <h3 className="font-heading font-bold text-2xl mb-4 text-slate-900">Ready to discuss your treatment options?</h3>
              <p className="text-slate-700 mb-8 text-lg">Dr. Arun Shah is available to provide a comprehensive evaluation and discuss if {treatment.frontmatter.title.toLowerCase()} is right for you.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white border-none h-14 px-8 shadow-md">
                  <a href="https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/20">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-2xl mb-6 mx-auto">
                  NU
                </div>
                <h3 className="font-heading font-bold text-xl mb-2 text-center text-slate-900">Expert Surgical Care</h3>
                <p className="text-slate-600 text-sm mb-6 text-center">
                  Our facility is equipped with state-of-the-art laser technology ensuring the highest standards of safety and efficacy.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" asChild className="w-full justify-center h-12 border-slate-300">
                    <a href="tel:+9779744427743">
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      Call for Enquiries
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
