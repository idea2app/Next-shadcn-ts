import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { author, baseURL, description, keywords, siteName } from "@/config";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

import logo from "../../public/logo.svg";

export const metadata: Metadata = {
  title: siteName,
  description: description,
  authors: [{ name: author }],
  keywords: keywords,
  openGraph: { images: [{ url: `${baseURL}/api/og` }] },
};

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1>{dict.hello_world}</h1>
        <Link href="/dashboard">
          <Image
            className="dark:invert"
            src={logo}
            alt="idea2.app logo"
            width={180}
            height={38}
            priority
          />
        </Link>
      </main>
    </div>
  );
}
