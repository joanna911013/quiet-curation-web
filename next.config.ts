import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: rootDir,
  },
  allowedDevOrigins: [
    "http://192.168.45.99:3000",
    "http://localhost:3000",
  ],
};

export default withNextIntl(nextConfig);
