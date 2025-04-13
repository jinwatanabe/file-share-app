// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

export default nextConfig;
