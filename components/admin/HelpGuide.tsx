import React from "react";
import {
  BookOpen,
  Image as ImageIcon,
  Layout,
  ShieldCheck,
} from "lucide-react";

export function HelpGuide() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dr. Arun&apos;s Digital Guide
            </h2>
            <p className="text-sm text-slate-600">
              A simple, non-technical manual for managing your website.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <Layout className="h-5 w-5 text-blue-600" />
              1. Writing & Editing Articles
            </h3>
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed space-y-4">
              <p>
                <strong>To create a new article:</strong> Navigate to the
                relevant section (like <em>Blogs</em> or <em>Treatments</em>) on
                the left menu, and click the blue{" "}
                <strong>&quot;Create New&quot;</strong> button in the top right.
              </p>
              <p>
                <strong>Using the Editor:</strong> You no longer need to know
                any code! Just type your content in the large text box. Use the
                toolbar at the top of the box to make text <strong>Bold</strong>
                , <em>Italic</em>, or to create bulleted lists—just like
                Microsoft Word.
              </p>
              <p>
                <strong>Draft Mode:</strong> If you are not ready to publish
                your article to the public website yet, simply toggle the{" "}
                <strong>&quot;Save as Draft&quot;</strong> switch before
                clicking Save. It will be safely saved in the system, but hidden
                from your patients.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              2. Uploading Photos
            </h3>
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed space-y-4">
              <p>
                <strong>Homepage Photo:</strong> Go to the{" "}
                <strong>Homepage Hero</strong> tab. Click &quot;Upload New
                Photo&quot; and select a high-quality picture from your
                computer. Our system will automatically compress and resize it
                so your website stays blazingly fast.
              </p>
              <p>
                <strong>Article Photos:</strong> Inside any article, you can
                click &quot;Upload Photo&quot;. The image will automatically
                appear at the top of the article.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              3. Search Engine Optimization (SEO)
            </h3>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-sm text-slate-700 leading-relaxed space-y-4">
              <p>
                We have built a dedicated <strong>SEO Engine</strong> directly
                into your editor so you can rank higher on Google!
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>SEO Title:</strong> This is the blue clickable link
                  that appears on Google. Keep it under 60 characters for the
                  best result.
                </li>
                <li>
                  <strong>SEO Description:</strong> This is the short paragraph
                  below the link on Google. It should briefly summarize the
                  article and convince patients to click.
                </li>
                <li>
                  <strong>Google Preview:</strong> As you type your SEO Title
                  and Description, look at the &quot;Live Google Preview&quot;
                  card to see exactly how it will look on the search engine!
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
