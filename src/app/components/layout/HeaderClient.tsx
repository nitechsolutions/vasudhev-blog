"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface Category {
  slug: string;
  name: string;
}

interface Language {
  code: string;
  name: string;
  is_default: boolean;
}

interface Props {
  currentLang: string;
  categories: Category[];
  languages: Language[];
}

export default function HeaderClient({
  currentLang,
  categories,
  languages,
}: Props) {
  const pathname = usePathname();

  /* Extract active category */
  const activeCategory = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments[1] || "";
  }, [pathname, currentLang]);

  const isHomeActive = useMemo(() => {
    if (currentLang === "hi") {
      return pathname === "/";
    }
    return pathname === `/${currentLang}`;
  }, [pathname, currentLang]);

  const getLangHref = (langCode: string) =>
    langCode === "hi" ? "/" : `/${langCode}`;

  const activeLanguage =
    languages.find((l) => l.code === currentLang);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* LOGO */}
        <Link href={getLangHref(currentLang)}>
          <Image
            src="/logo.png"
            alt="Taaza Time"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex space-x-6 font-medium items-center">

          {/* Home */}
          <Link
            href={getLangHref(currentLang)}
            className={`transition-colors ${
              isHomeActive
                ? "text-red-600 font-semibold border-b-2 border-red-600"
                : "hover:text-red-600"
            }`}
          >
            {currentLang === "en" ? "Home" : "होम"}
          </Link>

          {/* Categories */}
          {categories.map((cat) => {

            const isActive = activeCategory === cat.slug;

            return (
              <Link
                key={cat.slug}
                href={`/${currentLang}/${cat.slug}`}
                className={`capitalize transition-colors ${
                  isActive
                    ? "text-red-600 font-semibold border-b-2 border-red-600"
                    : "hover:text-red-600"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {/* LANGUAGE DROPDOWN */}
        <div className="relative group">
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">
            {activeLanguage?.name}
          </button>

          <div className="absolute right-0 w-32 bg-white border shadow-md hidden group-hover:block">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={getLangHref(lang.code)}
                className={`block px-3 py-2 text-sm hover:bg-gray-100 ${
                  lang.code === currentLang
                    ? "font-semibold text-red-600"
                    : ""
                }`}
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}