/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // picsum.photos serve as imagens placeholder (galeria, hero) usadas
      // enquanto a Von não carrega fotos reais dos seus trabalhos.
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
