import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = generateMetadata({
  title: "Terms of Service | National Urology Center",
  description:
    "Terms of service for the National Urology Center website. Read the conditions governing your use of our website and medical services in Janakpur, Nepal.",
});

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-50 py-16 md:py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Please read these terms carefully before using the National Urology
            Center website or our medical services.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Last updated: July 5, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-primary">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the National Urology Center website
              (drarunshah.com.np), you agree to be bound by these Terms of
              Service. If you do not agree with any part of these terms, please
              do not use our website. These terms apply to all visitors, users,
              and patients who access the website.
            </p>

            <h2>2. Medical Disclaimer</h2>
            <p>
              The content provided on this website is for general informational
              and educational purposes only. It is not intended to be a
              substitute for professional medical advice, diagnosis, or
              treatment. Always seek the advice of Dr. Arun Kumar Sah or
              another qualified healthcare provider with any questions you may
              have regarding a medical condition.
            </p>
            <p>
              Never disregard professional medical advice or delay seeking it
              because of something you have read on this website. For a
              comprehensive medical disclaimer, please visit our{" "}
              <Link href="/disclaimer">Medical Disclaimer</Link> page.
            </p>

            <h2>3. Website Use</h2>
            <p>You agree to use this website only for lawful purposes and in a manner that does not:</p>
            <ul>
              <li>
                Infringe the rights of, or restrict or inhibit the use and
                enjoyment of this website by, any third party.
              </li>
              <li>
                Attempt to gain unauthorized access to the website, server, or
                any connected databases.
              </li>
              <li>
                Introduce malicious software, viruses, or harmful code to the
                website.
              </li>
              <li>
                Reproduce, duplicate, or copy any material from this website
                without express written consent.
              </li>
            </ul>
            <p>
              We reserve the right to restrict or terminate your access to the
              website at any time, without notice, for conduct that we believe
              violates these terms.
            </p>

            <h2>4. Appointments</h2>
            <p>
              Appointment requests made through this website (including via
              WhatsApp or contact forms) are subject to availability and
              confirmation by National Urology Center. Submitting a request
              does not guarantee an appointment.
            </p>
            <ul>
              <li>
                Appointment confirmations will be communicated directly by our
                clinic staff.
              </li>
              <li>
                Patients are expected to arrive on time and provide accurate
                medical history.
              </li>
              <li>
                Cancellations or rescheduling should be communicated as early as
                possible to allow other patients access to care.
              </li>
            </ul>

            <h2>5. Limitation of Liability</h2>
            <p>
              National Urology Center, Dr. Arun Kumar Sah, and affiliated
              staff shall not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Your use of or inability to use this website.</li>
              <li>
                Any errors, inaccuracies, or omissions in the content provided
                on this website.
              </li>
              <li>
                Any unauthorized access to or alteration of your personal data.
              </li>
              <li>
                Any reliance on information provided on this website without
                seeking professional medical consultation.
              </li>
            </ul>
            <p>
              This website is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis without warranties of any kind, either
              express or implied.
            </p>

            <h2>6. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in
              accordance with the laws of Nepal. Any disputes arising from
              these terms or your use of this website shall be subject to the
              exclusive jurisdiction of the courts in Nepal.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              National Urology Center reserves the right to modify or replace
              these Terms of Service at any time. Changes will be effective
              immediately upon posting to this page. Your continued use of the
              website after any changes constitutes acceptance of the updated
              terms.
            </p>
            <p>
              We encourage you to review this page periodically to stay
              informed about our terms. If you have questions about these terms,
              please{" "}
              <Link href="/contact">contact us</Link>.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/disclaimer"
              className="text-primary hover:underline underline-offset-4"
            >
              Medical Disclaimer
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/contact"
              className="text-primary hover:underline underline-offset-4"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
