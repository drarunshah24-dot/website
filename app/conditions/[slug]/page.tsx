import { getMdxBySlug } from "@/lib/mdx";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Phone, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ConditionFrontmatter {
  title: string;
  summary: string;
  image?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const condition = await getMdxBySlug<ConditionFrontmatter>("conditions", resolvedParams.slug);
  
  if (!condition) {
    return { title: "Condition Not Found" };
  }

  return generateSeoMetadata({
    title: `${condition.frontmatter.title} | National Urology Center`,
    description: condition.frontmatter.summary,
    url: `/conditions/${resolvedParams.slug}`,
    image: condition.frontmatter.image,
    type: "article",
  });
}

export default async function ConditionPage({ params }: Props) {
  const resolvedParams = await params;
  const condition = await getMdxBySlug<ConditionFrontmatter>("conditions", resolvedParams.slug);

  if (!condition) {
    notFound();
  }

  return (
    <>
      <div className="bg-slate-50 py-8 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/conditions" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all conditions
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
              {condition.frontmatter.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              {condition.frontmatter.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Content (MDX) */}
          <div className="lg:col-span-8">
            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-primary">
              <MDXRemote source={condition.content} />
            </article>

            {/* Medical Disclaimer */}
            <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
              <strong>Medical Disclaimer:</strong> The information provided on this page is for educational purposes only and should not replace professional medical advice. Please consult Dr. Arun Shah for an accurate diagnosis and personalized treatment plan.
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-heading font-bold text-xl mb-4">Consult Dr. Arun Shah</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Get expert diagnosis and treatment for {condition.frontmatter.title.toLowerCase()} from a Gold Medalist urologist.
                </p>
                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full justify-center">
                    <a href="https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener noreferrer">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Consultation
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-center">
                    <a href="tel:+9779744427743">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Clinic
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
