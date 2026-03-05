import CategorySection from "../components/home/CategorySection";
import FeaturedSection from "../components/home/FeaturedSection";
import { getHomeData } from "../../lib/getHomeData";

export const revalidate = 60;

interface Props {
  params: { lang: string };
}

export default async function LanguageHomePage({ params }: Props) {
  const { lang } = await params;

  const { featured, trending, categoryData } = await getHomeData(lang);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 mt-12 grid lg:grid-cols-3 gap-8">
      <FeaturedSection posts={featured} lang={lang} />

      <CategorySection
        title={lang === "hi" ? "ट्रेंडिंग" : "Trending"}
        emoji="🔥"
        posts={trending}
        lang={lang}
      />

      {categoryData.map((cat) => (
        <CategorySection
          key={cat.slug}
          emoji={cat.emoji}
          title={cat.name}
          posts={cat.posts}
          lang={lang}
        />
      ))}
    </main>
  );
}
