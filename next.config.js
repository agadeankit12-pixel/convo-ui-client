/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from common avatar providers
  images: {
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
