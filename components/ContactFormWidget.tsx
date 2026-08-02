"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactFormWidget() {
  const [formData, setFormData] = useState({
    name: "",
    phoneOrEmail: "",
    service: "Kidney Stones (Laser / RIRS)",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneOrEmail || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Construct WhatsApp message URL for direct messaging to clinic
    const textMessage = `*New Contact Inquiry*\n\n*Name:* ${formData.name}\n*Contact:* ${formData.phoneOrEmail}\n*Service:* ${formData.service}\n*Message:* ${formData.message}`;
    const waUrl = `https://wa.me/9779744427743?text=${encodeURIComponent(textMessage)}`;

    setTimeout(() => {
      setStatus("success");
      window.open(waUrl, "_blank");
    }, 600);
  };

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-md">
      <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">
        Send Us a Message
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Have a question or want to share your medical history before your visit?
        Fill out the form below.
      </p>

      {status === "success" ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base mb-1">Message Ready to Send!</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Thank you, {formData.name}. We have forwarded your message to
              WhatsApp. Dr. Arun Shah&apos;s team will assist you shortly.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setFormData({
                  name: "",
                  phoneOrEmail: "",
                  service: "Kidney Stones (Laser / RIRS)",
                  message: "",
                });
              }}
              className="mt-4 text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Phone Number or Email *
            </label>
            <input
              type="text"
              required
              value={formData.phoneOrEmail}
              onChange={(e) =>
                setFormData({ ...formData, phoneOrEmail: e.target.value })
              }
              placeholder="+977 98XXXXXXX or name@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Treatment / Condition of Interest
            </label>
            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Kidney Stones (Laser / RIRS)">
                Kidney Stones (Laser / RIRS)
              </option>
              <option value="Prostate Enlargement (HoLEP / TURP)">
                Prostate Enlargement (HoLEP / TURP)
              </option>
              <option value="Male Sexual Health">Male Sexual Health</option>
              <option value="Urinary Tract Infection (UTI)">
                Urinary Tract Infection (UTI)
              </option>
              <option value="Pediatric / Other Urology Inquiry">
                Pediatric / Other Urology Inquiry
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Your Message or Symptoms *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Describe your inquiry or symptoms..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please fill in all required fields.</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-6 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            {status === "submitting" ? "Sending..." : "Submit Inquiry"}
          </Button>
        </form>
      )}
    </div>
  );
}
