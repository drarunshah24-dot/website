import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata = generateMetadata({
  title: "Medical Disclaimer | National Urology Center",
  description:
    "Medical disclaimer for the National Urology Center website. Understand the limitations of online health information and the importance of professional medical consultation.",
});

export default function DisclaimerPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-50 py-16 md:py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-6">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            Medical Disclaimer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Important information regarding the use of health content on the
            National Urology Center website.
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
            <h2>1. General Disclaimer</h2>
            <p>
              The information provided on the National Urology Center website
              (drarunshah.com.np) is intended for general informational and
              educational purposes only. All content, including text, graphics,
              images, and other material, is provided by Dr. Arun Kumar Sah and
              the National Urology Center team in Janakpur, Nepal.
            </p>
            <p>
              This website does not provide medical diagnoses or personalized
              treatment recommendations. The information should not be used as a
              basis for making health decisions without consulting a qualified
              medical professional.
            </p>

            <h2>2. Not a Substitute for Medical Advice</h2>
            <p>
              The content on this website is <strong>not</strong> a substitute
              for professional medical advice, diagnosis, or treatment. Always
              seek the advice of your physician or another qualified healthcare
              provider with any questions you may have regarding a medical
              condition.
            </p>
            <ul>
              <li>
                Do not disregard professional medical advice because of
                something you have read on this website.
              </li>
              <li>
                Do not delay seeking medical advice or treatment because of
                information found on this website.
              </li>
              <li>
                If you think you may have a medical emergency, call your doctor
                or emergency services immediately.
              </li>
            </ul>

            <h2>3. No Doctor-Patient Relationship</h2>
            <p>
              Viewing or using the information on this website does not
              establish a doctor-patient relationship between you and Dr. Arun
              Kumar Sah or National Urology Center. A doctor-patient
              relationship is only established through a formal, in-person
              consultation at our clinic.
            </p>
            <p>
              Any communication through this website, including WhatsApp
              messages and contact form submissions, is for appointment
              scheduling and general inquiry purposes only and does not
              constitute medical consultation.
            </p>

            <h2>4. Emergency Situations</h2>
            <div className="not-prose my-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Medical Emergency?
                </h3>
                <p className="text-red-700 mb-4">
                  If you are experiencing a medical emergency, do not use this
                  website. Call emergency services immediately or contact us
                  directly.
                </p>
                <a
                  href="tel:+9779814834756"
                  className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
                >
                  Call +977 9814834756
                </a>
              </div>
            </div>

            <h2>5. Accuracy of Information</h2>
            <p>
              National Urology Center makes every effort to ensure that the
              information on this website is accurate and up to date. However,
              medical science is constantly evolving, and we cannot guarantee
              that all information is complete, current, or error-free at all
              times.
            </p>
            <ul>
              <li>
                Treatment outcomes may vary from patient to patient based on
                individual health conditions.
              </li>
              <li>
                Information about procedures, conditions, and treatments is
                provided for general awareness and may not reflect the specific
                approach used at our center.
              </li>
              <li>
                We reserve the right to update or modify content at any time
                without prior notice.
              </li>
            </ul>

            <h2>6. External Links</h2>
            <p>
              This website may contain links to external websites or resources
              for your convenience and reference. National Urology Center does
              not endorse, control, or assume responsibility for the content,
              privacy policies, or practices of any third-party websites.
            </p>
            <p>
              Visiting external links is at your own risk, and we encourage you
              to read the terms and privacy policies of any website you visit.
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
              href="/terms"
              className="text-primary hover:underline underline-offset-4"
            >
              Terms of Service
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
