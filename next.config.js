// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.metawarrior.army',
        port: '',
        pathname: '/**',
      },
    ],
  },
}