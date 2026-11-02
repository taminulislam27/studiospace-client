/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy the Express server through the client domain so the HTTPOnly JWT
  // cookie is first-party (works on Vercel without third-party cookie issues).
  async rewrites() {
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
    return [
      {
        source: "/backend/:path*",
        destination: `${serverUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
