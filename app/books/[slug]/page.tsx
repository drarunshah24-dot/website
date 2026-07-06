import { getMdxBySlug, getAllMdx } from "@/lib/mdx";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ArrowLeft, Calendar, User, CheckCircle2 } from "lucide-react";

interface BookFrontmatter {
  title: string;
  cover: string;
  description: string;
  date: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const book = getMdxBySlug<BookFrontmatter>("books", resolvedParams.slug);
  
  if (!book) {
    return { title: "Publication Not Found" };
  }

  return generateSeoMetadata({
    title: `${book.frontmatter.title} | Dr. Arun Shah`,
    description: book.frontmatter.description,
    url: `/books/${resolvedParams.slug}`,
    image: book.frontmatter.cover,
    type: "article",
  });
}

export async function generateStaticParams() {
  const books = getAllMdx<BookFrontmatter>("books");
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export default async function BookPage({ params }: Props) {
  const resolvedParams = await params;
  const book = getMdxBySlug<BookFrontmatter>("books", resolvedParams.slug);

  if (!book) {
    notFound();
  }

  return (
    <>
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-primary text-sm font-semibold rounded-full border border-primary/20 mb-6 shadow-sm">
              <BookOpen className="w-4 h-4" />
              Published Medical Literature
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-6 leading-tight">
              {book.frontmatter.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
              {book.frontmatter.description}
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto items-start">
            <div className="md:col-span-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-md">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl overflow-hidden flex items-center justify-center mb-6 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://placehold.co/400x600/e2e8f0/475569?text=Book+Cover"
                  alt={book.frontmatter.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 text-sm border-t border-slate-200/60 pt-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-primary" />
                  <span><strong>Author:</strong> Dr. Arun Shah</span>
                </div>
                {book.frontmatter.date && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span><strong>Published:</strong> {new Date(book.frontmatter.date).getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 prose prose-lg prose-slate max-w-none">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mt-0 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Why This Publication Matters
                </h3>
                <p className="text-slate-600 text-base mb-0">
                  This work represents Dr. Arun Shah&apos;s commitment to advancing urological education and clinical excellence, providing essential insights for surgical practice.
                </p>
              </div>
              <MDXRemote source={book.content} />
              
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-slate-500">
                  Need a consultation with Dr. Arun Shah regarding urological conditions?
                </div>
                <Button asChild className="rounded-full">
                  <Link href="/contact">Book an Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
