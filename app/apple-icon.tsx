import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export const runtime = "edge";

export default function Icon() {
  try {
    return new ImageResponse(<div tw="text-2xl">🎨</div>, {
      ...size,
      emoji: "openmoji",
    });
  } catch (error) {
    console.error("apple icon generation error:", error);

    return new Response(`Failed to generate apple icon: ${error}`, {
      status: 500,
    });
  }
}
