import { Metadata } from "next"

export function generateHomeMetadata(): Metadata {
  return {
    title: "Latest Hindi News, Auto, Business & Tech Updates",
    description:
      "Get latest breaking news, automobile updates, business insights, and technology launches in Hindi.",
    keywords: [
      "Hindi News",
      "Auto News",
      "Business News",
      "Tech Updates",
      "Latest News India",
    ],
    openGraph: {
      title: "Latest Hindi News Portal",
      description:
        "Breaking Hindi news, automobile, business & tech updates.",
      type: "website",
      url: "https://yourdomain.com",
    },
    alternates: {
      canonical: "https://yourdomain.com",
    },
  }
}
