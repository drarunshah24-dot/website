import { getMdxBySlug, getAllMdx } from "@/lib/mdx";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import { buildArticleSchema } from "@/lib/schema";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";
import { Calendar, User, ArrowLeft, BookOpen, Share2 } from "lucide-react";

interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  category: string;
  image?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const post = getMdxBySlug<BlogFrontmatter>("blogs", resolvedParams.slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return generateSeoMetadata({
    title: `${post.frontmatter.title} | National Urology Center`,
    description: `Read ${post.frontmatter.title} by Dr. Arun Shah at National Urology Center, Janakpur.`,
    url: `/blog/${resolvedParams.slug}`,
    image: post.frontmatter.image,
    type: "article",
  });
}

export async function generateStaticParams() {
  const posts = getAllMdx<BlogFrontmatter>("blogs");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getMdxBySlug<BlogFrontmatter>("blogs", resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: post.frontmatter.title,
    description: `Read ${post.frontmatter.title} by Dr. Arun Shah at National Urology Center, Janakpur.`,
    url: `https://drarunshah.com.np/blog/${resolvedParams.slug}`,
    datePublished: post.frontmatter.date,
  });

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Article Header */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              {post.frontmatter.category || "Patient Education"}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              {post.frontmatter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {post.frontmatter.author || "Dr. Arun Shah"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Published on {post.frontmatter.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Sidebar */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Article Body */}
          <div className="lg:col-span-8">
            <div className="aspect-[16/9] mb-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://placehold.co/800x450/e2e8f0/475569?text=${encodeURIComponent(post.frontmatter.category || "Medical+Article")}`}
                alt={post.frontmatter.title}
                className="w-full h-full object-cover"
              />
            </div>

            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-a:text-primary prose-li:marker:text-primary">
              <MDXRemote source={post.content} />
            </article>

            {/* Author Bio Box */}
            <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dr-arun-shah-urologist-janakpur.jpg"
                  alt="Dr. Arun Shah"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">
                  About the Author: Dr. Arun Shah
                </h3>
                <p className="text-sm font-semibold text-primary mb-3">
                  Senior Consultant Urologist (M.Ch Gold Medalist)
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Dr. Arun Shah is a dedicated urologist practicing at National Urology Center in Janakpur, Nepal. With extensive training and a gold medal in M.Ch Urology, he specializes in advanced minimally invasive laser surgeries for kidney stones and prostate care.
                </p>
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link href="/about">View Full Profile</Link>
                </Button>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Medical Disclaimer:</strong> The information provided in this article is intended solely for educational and informational purposes. It does not constitute formal medical advice, professional diagnosis, or treatment recommendations. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40">
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  Need Expert Consultation?
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Have questions about your urological health? Schedule a one-on-one consultation with Dr. Arun Shah today.
                </p>
                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full justify-center shadow-md">
                    <a
                      href="https://wa.me/9779744427743?text=I%20would%20like%20to%20book%20an%20appointment."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book via WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link href="/contact">Contact Clinic Desk</Link>
                  </Button>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-heading font-bold text-slate-900 mb-4">
                  Explore Specialties
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <Link href="/conditions/kidney-stones" className="text-slate-700 hover:text-primary flex items-center justify-between transition-colors">
                      Kidney Stones (Patthari) <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-primary" />
                    </Link>
                  </li>
                  <li className="border-t border-slate-200 pt-3">
                    <Link href="/conditions/prostate-enlargement" className="text-slate-700 hover:text-primary flex items-center justify-between transition-colors">
                      Prostate Enlargement (BPH) <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-primary" />
                    </Link>
                  </li>
                  <li className="border-t border-slate-200 pt-3">
                    <Link href="/treatments/rirs-laser-surgery" className="text-slate-700 hover:text-primary flex items-center justify-between transition-colors">
                      RIRS Laser Surgery <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-primary" />
                    </Link>
                  </li>
                  <li className="border-t border-slate-200 pt-3">
                    <Link href="/treatments/holep-prostate-surgery" className="text-slate-700 hover:text-primary flex items-center justify-between transition-colors">
                      HoLEP Prostate Surgery <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-primary" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
