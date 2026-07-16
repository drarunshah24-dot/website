"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { AdminSection } from "./AdminNav";

export interface ContentItem {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  draft: boolean;
  image?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  body: string;
}

interface ContentListProps {
  activeSection: AdminSection;
  items: ContentItem[];
  isLoadingItems: boolean;
  loadItems: () => void;
  handleCreateNew: () => void;
  handleEdit: (item: ContentItem) => void;
  handleDelete: (slug: string) => void;
}

export function ContentList({
  activeSection,
  items,
  isLoadingItems,
  loadItems,
  handleCreateNew,
  handleEdit,
  handleDelete,
}: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
          <p className="mt-1 text-sm text-slate-600">
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingItems ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
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
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* List Table */}
      {isLoadingItems ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <h3 className="text-base font-bold text-slate-900">No items found</h3>
          <p className="mb-6 mt-1 text-sm text-slate-500">
            Add your first item to this section.
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Photo</th>
                  <th className="px-6 py-4">Title</th>
                  {(activeSection === "books" ||
                    activeSection === "treatments" ||
                    activeSection === "conditions" ||
                    activeSection === "faq") && (
                    <th className="px-6 py-4">Description / Summary</th>
                  )}
                  <th className="px-6 py-4">Date / Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item) => (
                  <tr
                    key={item.slug}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      {item.image ? (
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {item.title}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-slate-400">
                        /{activeSection}/{item.slug}
                      </div>
                    </td>
                    {(activeSection === "books" ||
                      activeSection === "treatments" ||
                      activeSection === "conditions" ||
                      activeSection === "faq") && (
                      <td className="max-w-xs truncate px-6 py-4 text-slate-600">
                        {item.description || item.body || "—"}
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-500">
                      <div>{item.date}</div>
                      {item.category && (
                        <div className="mt-0.5 text-xs font-medium text-blue-600">
                          {item.category}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Edit Item"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.slug)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
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
  );
}
