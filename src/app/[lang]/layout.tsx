import Header from "@/app/components/layout/Header";
import Footer from "../components/layout/Footer";

interface LayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = (await params) || "hi";

  return (
    <>
      <Header currentLang={lang} />
      <main>{children}</main>
    </>
  );
}
