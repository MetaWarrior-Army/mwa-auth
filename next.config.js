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
      {
        protocol: 'https',
        hostname: "violet-tremendous-rhinoceros-811.mypinata.cloud", // Pinata IPFS Domain Gateway
        port: '',
        pathname: '/**',
      },
    ],
  },
}