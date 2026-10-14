import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root. Without this Next walks up and finds an unrelated
  // lockfile in the parent directory and infers the wrong root.
  outputFileTracingRoot: projectRoot,
  // Static export keeps the site deployable to Netlify, Vercel, or any plain
  // static host. All imagery is pre-compressed by tools/build-assets.mjs, so the
  // Next image optimizer is not needed at runtime.
  images: { unoptimized: true },
  reactStrictMode: true,
  trailingSlash: true,
  // The admin dashboard is a prebuilt static app in public/admin.
  async rewrites() {
    return [{ source: '/admin/', destination: '/admin/index.html' }];
  },
};

export default nextConfig;
