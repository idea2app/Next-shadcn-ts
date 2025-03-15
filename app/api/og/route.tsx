/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import { description as siteDescription, siteName } from "@/config";

/**
 * Open Graph Image Generation
 *
 * Resources:
 * - OG Playground: https://og-playground.vercel.app/
 *   Interactive playground for testing OG image generation
 *
 * - Next.js Docs: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-image-generation
 *   Official documentation on dynamic image generation
 *
 * - Local Fonts Example: https://nextjs-book.innei.in/reading/project/og-image
 *   Implementation example with local font loading
 *
 * - HTML and CSS Support: https://github.com/vercel/satori/blob/main/src/handler/presets.ts
 *   Reference for supported HTML elements and attributes
 */

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { title = siteName, description = siteDescription } =
    Object.fromEntries(searchParams);

  try {
    const logoResponse = await fetch(
      new URL("../../../public/logo.svg", import.meta.url),
    );
    const logoBuffer = await logoResponse.arrayBuffer();

    const logoBase64 = Buffer.from(logoBuffer).toString("base64");
    const logoMimeType =
      logoResponse.headers.get("content-type") || "image/svg+xml";
    const logoDataUrl = `data:${logoMimeType};base64,${logoBase64}`;

    return new ImageResponse(
      (
        <div
          tw="h-full w-full flex text-center items-center justify-center flex-col flex-nowrap bg-white"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            gap: "32px",
          }}
        >
          <img src={logoDataUrl} width={200} height={200} />
          <hgroup tw="flex flex-col items-center" style={{ gap: "16px" }}>
            <h2 tw="font-bold text-black text-4xl m-0">{title}</h2>
            <p tw="text-gray-500 text-lg">{description}</p>
          </hgroup>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("OG Image generation error:", error);

    return new Response(`Failed to generate image: ${error}`, { status: 500 });
  }
}
