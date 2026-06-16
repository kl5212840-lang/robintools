import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // GitHub Pages: static export + /robintools basePath
  // Vercel: server mode + no basePath (auto-detect)
  output: isVercel ? undefined : "export",
  basePath: isVercel ? "" : "/robintools",
  images: {
    unoptimized: !isVercel,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
