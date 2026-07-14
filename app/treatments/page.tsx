import { getAllMdx } from "@/lib/mdx";
import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateMetadata({
  title: "Advanced Urological Treatments | National Urology Center",
  description: "Explore our state-of-the-art urological treatments, including minimally invasive laser surgery for kidney stones, prostate enlargement, and reconstructive procedures.",
});

interface TreatmentFrontmatter {
  title: string;
  description: string;
  image?: string;
}

export default async function TreatmentsHubPage() {
  const treatments = await getAllMdx<TreatmentFrontmatter>("treatments");

  return (
    <>
      <section className="bg-primary text-primary-foreground py-10 border-b border-primary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">Advanced Surgical & Medical Treatments</h1>
            <p className="text-base text-white/90 leading-relaxed">
              We specialize in the latest, minimally invasive laser techniques to provide you with faster recovery times, minimal pain, and superior outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          {treatments.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>No treatments published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatments.map((treatment) => (
                <Link key={treatment.slug} href={`/treatments/${treatment.slug}`} className="block h-full">
                  <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer bg-white h-full flex flex-col hover:-translate-y-1">
                    <CardHeader className="flex-1">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{treatment.frontmatter.title}</CardTitle>
                      <CardDescription className="text-base pt-2 line-clamp-3">
                        {treatment.frontmatter.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 border-t border-slate-50">
                      <span className="text-emerald-600 font-semibold flex items-center gap-2 group-hover:underline">
                        Learn about procedure <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
