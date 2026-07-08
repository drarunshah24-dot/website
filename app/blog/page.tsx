import { getAllMdx } from "@/lib/mdx";
import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, ArrowRight, MessageCircle, User } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = generateMetadata({
  title: "Patient Education Blog | National Urology Center",
  description:
    "Expert health articles on urological conditions, treatments, and preventive care from Dr. Arun Shah at the National Urology Center, Janakpur Nepal.",
});

interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  category: string;
  image?: string;
}

export default function BlogPage() {
  const posts = getAllMdx<BlogFrontmatter>("blogs");

  return (
    <>
      {/* Header */}
      <section className="bg-slate-50 py-16 md:py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            Patient Education & Health Articles
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed with expert insights on urological health, conditions,
            treatments, and preventive care from Dr. Arun Shah.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>No blog articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  className="border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col bg-white overflow-hidden rounded-2xl"
                >
                  <div className="aspect-[16/9] relative bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(post.frontmatter.category || "Medical+Article")}`}
                      alt={post.frontmatter.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">
                        {post.frontmatter.category || "Urology Care"}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="flex-1 pt-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {post.frontmatter.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                        {post.frontmatter.author || "Dr. Arun Kumar Sah"}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors leading-snug">
                      {post.frontmatter.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 border-t border-slate-50">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary font-semibold flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                    >
                      Read article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12 max-w-3xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">
              Have a Health Question or Need Consultation?
            </h3>
            <p className="text-slate-600 mb-8 text-lg">
              If you are experiencing urological symptoms, do not wait. Schedule an appointment with Dr. Arun Kumar Sah for expert evaluation and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="rounded-full px-8 shadow-md">
                <a
                  href="https://wa.me/9779814834756?text=I%20would%20like%20to%20book%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-8 bg-white"
              >
                <Link href="/contact">
                  Contact Clinic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
