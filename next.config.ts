import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/decap",
        destination: "/admin/index.html",
      },
      {
        source: "/config.yml",
        destination: "/admin/config.yml",
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
