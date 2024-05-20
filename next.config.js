/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploadthing.com", "lh3.googleusercontent.com", "utfs.io"],
  },
  exclude: [
    ["prisma/seed/**/*.{ts,tsx}"],
  ]
};

module.exports = nextConfig;
