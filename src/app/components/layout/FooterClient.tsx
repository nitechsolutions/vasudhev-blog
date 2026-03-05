"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  slug: string;
  name: string;
}

interface Props {
  currentLang: string;
  categories: Category[];
}

export default function Footer({ currentLang, categories }: Props) {
  const pathname = usePathname();

  const basePath = currentLang === "hi" ? "" : `/${currentLang}`;

  const year = new Date().getFullYear();

  return (
    <footer className=" bg-gray-300 text-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">
        {/* ABOUT SECTION */}
        <div>
          <img src="/logo.png" alt="vasudhev.com"  className="h-25 w-50" />
          <p className="text-sm leading-6">
            Vasudhev is a multilingual news and information platform covering
            tech, finance, auto and health insights.
          </p>
        </div>

        {/* CATEGORIES (Internal Linking Boost SEO) */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-4">
            {currentLang === "hi" ? "श्रेणियाँ" : "Categories"}
          </h3>

          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={
                    currentLang === "hi"
                      ? `/${cat.slug}`
                      : `/${currentLang}/${cat.slug}`
                  }
                  className="hover:text-white transition"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* IMPORTANT PAGES (Trust + AdSense Approval) */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-4">
            Important Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`${basePath}/about`} className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/contact`} className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/privacy-policy`}
                className="hover:text-white"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/terms`} className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* MONETIZATION SECTION */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-4">
            Opportunities
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`${basePath}/advertise`} className="hover:text-white">
                Advertise With Us
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/guest-post`}
                className="hover:text-white"
              >
                Guest Post
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/affiliate-disclosure`}
                className="hover:text-white"
              >
              
                  Affiliate Disclosure
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-gray-700 text-center text-sm py-6">
        © {year} Vasudhev.{" "}
        All Rights Reserved.
      </div>
    </footer>
  );
}
