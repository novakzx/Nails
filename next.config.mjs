/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Fotos de unhas/manicure (licença Unsplash, uso comercial livre)
      // usadas na Hero, Galeria e Sobre até a Von carregar fotos próprias.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
