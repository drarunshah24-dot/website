export const BASE_URL = "https://drarunshah.com.np";

export function buildPhysicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: "Dr. Arun Shah",
    alternateName: "Dr. Arun Kumar Shah",
    description: "Gold Medalist Urologist specializing in advanced laser surgery, kidney stones, and prostate treatments in Janakpur.",
    url: `${BASE_URL}/about`,
    image: `${BASE_URL}/dr-arun-shah-urologist-janakpur.jpg`,
    jobTitle: "Senior Consultant Urologist",
    medicalSpecialty: "Urology",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Dashrath Pond",
      addressLocality: "Janakpurdham-06",
      addressRegion: "Madhesh Province",
      addressCountry: "NP",
    },
    telephone: ["+9779814834756", "+9779744427743"],
    email: "info@drarunshah.com.np",
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Institute of Medicine (IOM), Tribhuvan University",
      },
    ],
  };
}

export function buildMedicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "National Urology Center",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    image: `${BASE_URL}/images/clinic-exterior.jpg`,
    description: "Premier urology clinic in Janakpur offering state-of-the-art care for kidney stones, prostate issues, and male reproductive health.",
    telephone: ["+9779814834756", "+9779744427743"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Dashrath Pond",
      addressLocality: "Janakpurdham-06",
      addressRegion: "Madhesh Province",
      addressCountry: "NP",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    medicalSpecialty: ["Urology"],
  };
}

export function buildArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: "Dr. Arun Shah",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "National Urology Center",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
