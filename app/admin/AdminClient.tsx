/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Building2,
  Image as ImageIcon,
  Upload,
  UserCheck,
  Stethoscope,
  HelpCircle,
  Activity,
} from "lucide-react";

interface ContentItem {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  draft: boolean;
  image?: string;
  description?: string;
  body: string;
}

export function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("admin@drarunshah.com.np");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Section Tab
  const [activeSection, setActiveSection] = useState<
    | "blog"
    | "books"
    | "gallery"
    | "treatments"
    | "conditions"
    | "faq"
    | "settings"
  >("blog");

  // Content List State
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Editor States
  const [activeTab, setActiveTab] = useState<"list" | "editor">("list");
  const [currentItem, setCurrentItem] = useState<ContentItem>({
    slug: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
    author: "Dr. Arun Shah",
    category: "General Urology",
    draft: false,
    image: "",
    description: "",
    body: "",
  });
  const [editorPreview, setEditorPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [heroPhotoTimestamp, setHeroPhotoTimestamp] = useState(1);
  const [heroPhotoPreviewUrl, setHeroPhotoPreviewUrl] = useState("");
  const [heroUploadMessage, setHeroUploadMessage] = useState("");

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    doctorName: "Dr. Arun Shah",
    subtitle: "Senior Urologist & Gold Medalist",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveMessage, setSettingsSaveMessage] = useState("");

  const loadItems = async (section = activeSection) => {
    setIsLoadingItems(true);
    try {
      const res = await fetch(
        `/api/admin/content?type=${section}&_ts=${Date.now()}`,
        {
          cache: "no-store",
        },
      );
      const data = await res.json();
      if (data.success) {
        if (section === "settings") {
          if (data.settings) {
            setSiteSettings({
              doctorName: data.settings.doctorName || "Dr. Arun Shah",
              subtitle:
                data.settings.subtitle || "Senior Urologist & Gold Medalist",
            });
            if (data.settings.heroDoctorPhoto) {
              setHeroPhotoPreviewUrl(data.settings.heroDoctorPhoto);
            }
          }
        } else {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const t = setTimeout(() => {
        loadItems(activeSection);
        if (activeSection !== "settings") {
          setActiveTab("list");
        }
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, activeSection]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid password.");
      }
    } catch (err) {
      setLoginError("An error occurred during login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSaveMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          type: "settings",
          settings: siteSettings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSaveMessage("Homepage settings updated successfully.");
      } else {
        setSettingsSaveMessage(data.error || "Failed to update settings.");
      }
    } catch (err) {
      setSettingsSaveMessage("Server error while saving settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCreateNew = () => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentItem({
      slug: "",
      title: "",
      date: today,
      author: "Dr. Arun Shah",
      category:
        activeSection === "books"
          ? "Urology Guide"
          : activeSection === "gallery"
            ? "Facility"
            : activeSection === "treatments"
              ? "Surgical Procedure"
              : activeSection === "conditions"
                ? "Patient Guide"
                : activeSection === "faq"
                  ? "General FAQ"
                  : "General Urology",
      draft: false,
      image: "",
      description:
        activeSection === "books"
          ? "Short book description..."
          : activeSection === "treatments"
            ? "Brief overview of the treatment procedure..."
            : activeSection === "conditions"
              ? "Summary of symptoms or condition..."
              : "",
      body:
        activeSection === "books" || activeSection === "gallery"
          ? ""
          : activeSection === "faq"
            ? "Write the clear, concise answer here..."
            : "Write your article markdown here...",
    });
    setActiveTab("editor");
    setSaveMessage("");
  };

  const handleEdit = (item: ContentItem) => {
    setCurrentItem({ ...item });
    setActiveTab("editor");
    setSaveMessage("");
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(
        `/api/admin/content?type=${activeSection}&slug=${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${password}`,
          },
        },
      );
      const rawText = await res.text();
      let data: {
        success: boolean;
        error?: string;
        url?: string;
        [key: string]: unknown;
      } = { success: false, error: rawText || "Server error" };
      try {
        data = JSON.parse(rawText);
      } catch {
        // Server returned plain text or HTML instead of JSON
      }
      if (data.success) {
        setItems(items.filter((i) => i.slug !== slug));
      } else {
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isHero = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setHeroUploadMessage("");

    // Helper to convert File to Base64
    const toBase64 = (f: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64DataUrl = await toBase64(file);
      const filename = isHero
        ? "dr-arun-shah-urologist-janakpur.jpg"
        : `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase()}`;

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          filename,
          base64Content: base64DataUrl,
          commitMessage: `Upload image: ${filename} via Admin Portal`,
        }),
      });

      const rawText = await res.text();
      let data: {
        success: boolean;
        error?: string;
        url?: string;
        rawUrl?: string;
        [key: string]: unknown;
      } = { success: false, error: rawText || "Server error" };
      try {
        data = JSON.parse(rawText);
      } catch {
        // Server returned plain text or HTML instead of JSON
      }
      if (data.success) {
        if (isHero) {
          setHeroPhotoTimestamp(Date.now());
          if (typeof data.rawUrl === "string" && data.rawUrl) {
            setHeroPhotoPreviewUrl(data.rawUrl);
          } else if (typeof data.url === "string" && data.url) {
            setHeroPhotoPreviewUrl(`${data.url}?_ts=${Date.now()}`);
          }
          setHeroUploadMessage(
            "1st Page Doctor Photo updated successfully! It is visible here right now, and Cloudflare is rebuilding the site so it appears live on the homepage (~1-2 mins).",
          );
        } else {
          setCurrentItem((prev) => ({
            ...prev,
            image:
              typeof data.rawUrl === "string" && data.rawUrl
                ? data.rawUrl
                : typeof data.url === "string"
                  ? data.url
                  : "",
          }));
        }
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.title) {
      alert("Please enter a title.");
      return;
    }

    const autoSlug =
      currentItem.slug ||
      currentItem.title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    setIsSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          type: activeSection,
          ...currentItem,
          slug: autoSlug,
        }),
      });
      const rawText = await res.text();
      let data: {
        success: boolean;
        error?: string;
        url?: string;
        [key: string]: unknown;
      } = { success: false, error: rawText || "Server error" };
      try {
        data = JSON.parse(rawText);
      } catch {
        // Server returned plain text or HTML instead of JSON
      }
      if (data.success) {
        setSaveMessage("Saved directly to filesystem!");
        await loadItems(activeSection);
        setTimeout(() => {
          setActiveTab("list");
        }, 1200);
      } else {
        alert("Save failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Physician Direct Login
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              National Urology Center • Content Manager
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Physician Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="admin@drarunshah.com.np"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter any password to sign in"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Direct Sign In</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              NU
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">
                National Urology Center
              </h1>
              <p className="text-xs text-slate-500">
                Full Website Content & Media Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Website
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Section Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 overflow-x-auto py-3">
          <button
            onClick={() => setActiveSection("blog")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "blog"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog & Articles</span>
          </button>

          <button
            onClick={() => setActiveSection("treatments")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "treatments"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Treatments</span>
          </button>

          <button
            onClick={() => setActiveSection("conditions")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "conditions"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Conditions</span>
          </button>

          <button
            onClick={() => setActiveSection("faq")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "faq"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </button>

          <button
            onClick={() => setActiveSection("books")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "books"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Books & Publications</span>
          </button>

          <button
            onClick={() => setActiveSection("gallery")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "gallery"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>State-of-the-Art Facilities</span>
          </button>

          <button
            onClick={() => setActiveSection("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition shrink-0 ${
              activeSection === "settings"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Homepage Settings</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {" "}
        {activeSection === "settings" ? (
          /* HOMEPAGE SETTINGS MANAGER */
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Homepage Settings
                  </h2>
                  <p className="text-sm text-slate-600">
                    Manage the main text and hero photograph displayed
                    prominently on the home page.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <form
                  onSubmit={handleSaveSettings}
                  className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Title & Subtitle
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Doctor Name (Main Title)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.doctorName}
                      onChange={(e) =>
                        setSiteSettings((s) => ({
                          ...s,
                          doctorName: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Subtitle (e.g. Senior Urologist & Gold Medalist)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.subtitle}
                      onChange={(e) =>
                        setSiteSettings((s) => ({
                          ...s,
                          subtitle: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
                    >
                      {isSavingSettings ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                    {settingsSaveMessage && (
                      <p className="mt-3 text-sm text-emerald-600 font-medium">
                        {settingsSaveMessage}
                      </p>
                    )}
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      Current Live Homepage Portrait
                    </p>
                    <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
                      <img
                        src={
                          heroPhotoPreviewUrl ||
                          `/dr-arun-shah-urologist-janakpur.jpg?t=${heroPhotoTimestamp}`
                        }
                        alt="Dr. Arun Shah"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Select a high-resolution JPG or PNG image of Dr. Arun
                      Shah. The photo will automatically update across the 1st
                      page Hero section.
                    </p>

                    <label className="block w-full cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <div className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition">
                        {isUploading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Uploading & Replacing...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span>Upload New Doctor Photo</span>
                          </>
                        )}
                      </div>
                    </label>

                    {heroUploadMessage && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{heroUploadMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "list" ? (
          /* CONTENT LISTING TABLE (Blogs, Books, Gallery) */
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {activeSection === "blog" && "Urology Articles & Blog Posts"}
                  {activeSection === "books" && "Books & Medical Publications"}
                  {activeSection === "gallery" &&
                    "State-of-the-Art Clinic Facilities"}
                  {activeSection === "treatments" &&
                    "Advanced Surgical Treatments & Procedures"}
                  {activeSection === "conditions" &&
                    "Urological Conditions & Patient Guides"}
                  {activeSection === "faq" && "Frequently Asked Questions"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {activeSection === "blog" &&
                    "Manage patient education articles and urology posts."}
                  {activeSection === "books" &&
                    "Manage authored books and medical literature with cover photos."}
                  {activeSection === "gallery" &&
                    "Add and edit state-of-the-art clinic equipment and facility photos."}
                  {activeSection === "treatments" &&
                    "Manage urological procedures, laser surgeries, and treatment descriptions."}
                  {activeSection === "conditions" &&
                    "Manage urological condition guides and symptom overviews."}
                  {activeSection === "faq" &&
                    "Manage frequently asked questions and patient answers."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => loadItems()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition shadow-sm"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoadingItems ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>

                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Add{" "}
                    {activeSection === "blog"
                      ? "Article"
                      : activeSection === "books"
                        ? "Book / Publication"
                        : activeSection === "gallery"
                          ? "Facility Photo"
                          : activeSection === "treatments"
                            ? "Treatment"
                            : activeSection === "conditions"
                              ? "Condition"
                              : "FAQ"}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* List Table */}
            {isLoadingItems ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-600 font-medium">
                  Loading items...
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  No items found
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Add your first item to this section.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add New Item
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Photo</th>
                        <th className="py-4 px-6">Title</th>
                        {(activeSection === "books" ||
                          activeSection === "treatments" ||
                          activeSection === "conditions" ||
                          activeSection === "faq") && (
                          <th className="py-4 px-6">Description / Summary</th>
                        )}
                        <th className="py-4 px-6">Date / Category</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredItems.map((item) => (
                        <tr
                          key={item.slug}
                          className="hover:bg-slate-50/70 transition"
                        >
                          <td className="py-4 px-6">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              /{activeSection}/{item.slug}
                            </div>
                          </td>
                          {(activeSection === "books" ||
                            activeSection === "treatments" ||
                            activeSection === "conditions" ||
                            activeSection === "faq") && (
                            <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                              {item.description || item.body || "—"}
                            </td>
                          )}
                          <td className="py-4 px-6 text-slate-500">
                            <div>{item.date}</div>
                            {item.category && (
                              <div className="text-xs text-blue-600 font-medium mt-0.5">
                                {item.category}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Item"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.slug)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EDITOR FOR BLOGS, BOOKS, OR GALLERY */
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveTab("list")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentItem.title}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* CATEGORY FIELD FOR BLOG, TREATMENTS, CONDITIONS, & FAQ */}
                {(activeSection === "blog" ||
                  activeSection === "treatments" ||
                  activeSection === "conditions" ||
                  activeSection === "faq") && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={currentItem.category || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          category: e.target.value,
                        })
                      }
                      placeholder={
                        activeSection === "faq"
                          ? "e.g., Surgery, Appointments, Symptoms"
                          : "e.g., Laser Urology, Kidney Health"
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                )}

                {/* PHOTO UPLOAD / URL FIELD */}
                {activeSection !== "faq" && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      Photo / Cover Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {currentItem.image ? (
                        <img
                          src={currentItem.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-xl border border-slate-300"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={currentItem.image || ""}
                            onChange={(e) =>
                              setCurrentItem({
                                ...currentItem,
                                image: e.target.value,
                              })
                            }
                            placeholder="/uploads/my-photo.jpg"
                            className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono"
                          />
                          <label className="cursor-pointer px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {isUploading ? "Uploading..." : "Upload Photo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, false)}
                              disabled={isUploading}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">
                          Upload any JPG or PNG photo directly from your device
                          or paste an image URL.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(activeSection === "books" ||
                  activeSection === "treatments" ||
                  activeSection === "conditions") && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      {activeSection === "books"
                        ? "Short Description"
                        : "Summary / Brief Overview"}
                    </label>
                    <textarea
                      rows={3}
                      value={currentItem.description || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          description: e.target.value,
                        })
                      }
                      placeholder={
                        activeSection === "books"
                          ? "Summary of publication or book..."
                          : "Concise summary that appears on cards and search..."
                      }
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                )}

                {activeSection !== "books" && activeSection !== "gallery" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      {activeSection === "faq"
                        ? "FAQ Answer (Markdown or Text)"
                        : "Article / Guide Detailed Markdown Body"}
                    </label>
                    <textarea
                      rows={12}
                      value={currentItem.body}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, body: e.target.value })
                      }
                      placeholder="Write your content here..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono"
                    />
                  </div>
                )}

                {saveMessage && (
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>{saveMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab("list")}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Item"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
