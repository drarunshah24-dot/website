import { getAllMdx } from "@/lib/mdx";
import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata = generateMetadata({
  title: "Publications & Books | National Urology Center",
  description:
    "Explore urology books and publications by Dr. Arun Shah. Essential reading for medical professionals and patients.",
});

interface BookFrontmatter {
  title: string;
  cover: string;
  description: string;
  date: string;
}

export default async function BooksHubPage() {
  const books = await getAllMdx<BookFrontmatter>("books");

  return (
    <>
      <section className="bg-slate-50 py-10 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-primary text-sm font-semibold rounded-full border border-primary/20 mb-6">
              <BookOpen className="w-4 h-4" />
              Published Author
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Publications by Dr. Arun Shah
            </h1>
            <p className="text-base text-slate-600">
              Dr. Shah is a recognized authority in urology, contributing to
              medical literature and advancing surgical knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {books.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>No publications available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                        unoptimized
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
          )}
        </div>
      </section>
    </>
  );
}
