/** @type {import('next').NextConfig} */
const { withAxiom } = require("next-axiom");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = withAxiom(nextConfig);
