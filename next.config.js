/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", pathname: "**", hostname: "uploadthing.com" },
      { protocol: "https", pathname: "**", hostname: "utfs.io" },
      { protocol: "https", pathname: "**", hostname: "stream.mux.com" },
      {
        protocol: "https",
        pathname: "**",
        hostname: "lh3.googleusercontent.com",
      },
      { protocol: "https", pathname: "**", hostname: "tailwindui.com" },
      { protocol: "https", pathname: "**", hostname: "img.clerk.com" },
    ],
  },
};

module.exports = nextConfig;
