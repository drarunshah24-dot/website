import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FaqItem {
  slug: string;
  frontmatter: {
    title: string;
    category?: string;
  };
  content: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            Patient FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Find quick answers to common questions about urological symptoms, laser surgeries, and clinic appointments.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <Accordion defaultValue={[faqs[0]?.slug || "faq-0"]} className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.slug}
                value={faq.slug}
                className="bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-xs"
              >
                <AccordionTrigger className="text-base md:text-lg font-heading font-semibold text-slate-900 py-4 hover:text-primary">
                  {faq.frontmatter.title}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm md:text-base leading-relaxed pb-4 pt-1">
                  {faq.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
