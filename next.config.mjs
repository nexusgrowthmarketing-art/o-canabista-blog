/** @type {import('next').NextConfig} */
const nextConfig = {
  // Garante que os arquivos de conteúdo (content/*.json) sejam incluídos no
  // bundle das funções na Vercel, para a leitura funcionar em runtime.
  outputFileTracingIncludes: {
    "/**": ["./content/**"],
  },
  images: {
    // Libere aqui os hosts das imagens reais quando plugar o CMS.
    // Exemplos prontos: Sanity, Cloudinary, Unsplash. Ajuste em produção.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
