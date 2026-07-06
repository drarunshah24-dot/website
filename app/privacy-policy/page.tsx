import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = generateMetadata({
  title: "Privacy Policy | National Urology Center",
  description:
    "Read the privacy policy of National Urology Center, Janakpur Nepal. Learn how Dr. Arun Kumar Sah's clinic collects, uses, and protects your personal and medical information.",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-slate-50 py-16 md:py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how National
            Urology Center collects, uses, and safeguards your information.
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
            <h2>1. Information We Collect</h2>
            <p>
              National Urology Center, operated by Dr. Arun Kumar Sah in
              Janakpur, Nepal, may collect the following types of information
              when you use our website or visit our clinic:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, phone number, email
                address, and other contact details you provide when booking an
                appointment or submitting an inquiry.
              </li>
              <li>
                <strong>Medical Information:</strong> Health history, symptoms,
                diagnoses, and treatment records relevant to the urological care
                you receive.
              </li>
              <li>
                <strong>Technical Information:</strong> Browser type, IP
                address, pages visited, and other usage data collected
                automatically through cookies and analytics tools.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              The information we collect is used solely for the following
              purposes:
            </p>
            <ul>
              <li>
                To schedule and manage your appointments with Dr. Arun Kumar
                Sah.
              </li>
              <li>
                To provide accurate diagnoses, treatment plans, and follow-up
                care.
              </li>
              <li>
                To communicate important health-related information and updates.
              </li>
              <li>
                To improve the functionality and user experience of our website.
              </li>
              <li>
                To comply with legal and regulatory obligations under the laws
                of Nepal.
              </li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal and medical data against unauthorized
              access, alteration, disclosure, or destruction. These measures
              include:
            </p>
            <ul>
              <li>Secure storage of patient records and medical files.</li>
              <li>
                Restricted access to personal information on a need-to-know
                basis.
              </li>
              <li>Use of encrypted connections (HTTPS) on our website.</li>
            </ul>
            <p>
              While we strive to protect your information, no method of
              electronic transmission or storage is 100% secure. We cannot
              guarantee absolute security.
            </p>

            <h2>4. Third-Party Services</h2>
            <p>
              Our website may use third-party services such as analytics
              providers and messaging platforms (e.g., WhatsApp for appointment
              booking). These services may collect information as governed by
              their own privacy policies. We encourage you to review the
              privacy policies of any third-party service you interact with
              through our website.
            </p>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties for marketing purposes.
            </p>

            <h2>5. Patient Rights</h2>
            <p>As a patient of National Urology Center, you have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of the personal and
                medical information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request corrections to any
                inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> Request the deletion of your personal
                data, subject to legal and medical record-keeping obligations.
              </li>
              <li>
                <strong>Restriction:</strong> Request limitations on how your
                data is processed.
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for data
                processing at any time, where applicable.
              </li>
            </ul>

            <h2>6. Contact for Privacy Concerns</h2>
            <p>
              If you have any questions or concerns regarding this Privacy
              Policy or how your data is handled, please contact us:
            </p>
            <ul>
              <li>
                <strong>National Urology Center</strong>
              </li>
              <li>Dr. Arun Kumar Sah, Senior Consultant Urologist</li>
              <li>Janakpur, Madhesh Province, Nepal</li>
              <li>
                Phone:{" "}
                <a href="tel:+9779814834756">+977 9814834756</a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/9779814834756"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message us on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/terms"
              className="text-primary hover:underline underline-offset-4"
            >
              Terms of Service
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
