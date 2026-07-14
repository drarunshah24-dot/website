import { getAllMdx } from "@/lib/mdx";
import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Stethoscope } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateMetadata({
  title: "Urological Conditions | National Urology Center",
  description: "Learn about the symptoms, causes, and treatments for common urological conditions including kidney stones, prostate enlargement, and UTIs.",
});

interface ConditionFrontmatter {
  title: string;
  summary: string;
  image?: string;
}

export default async function ConditionsHubPage() {
  const conditions = await getAllMdx<ConditionFrontmatter>("conditions");

  return (
    <>
      <section className="bg-slate-50 py-10 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Understanding Your Symptoms</h1>
            <p className="text-base text-slate-600">
              Explore comprehensive information on various urological conditions. Education is the first step toward effective treatment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {conditions.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>No conditions published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {conditions.map((condition) => (
                <Link key={condition.slug} href={`/conditions/${condition.slug}`} className="block h-full">
                  <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full flex flex-col hover:-translate-y-1">
                    <CardHeader className="flex-1">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <CardTitle>{condition.frontmatter.title}</CardTitle>
                      <CardDescription className="text-base pt-2 line-clamp-3">
                        {condition.frontmatter.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 border-t border-slate-50">
                      <span className="text-primary font-medium flex items-center gap-2 group-hover:underline">
                        Read full guide <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
