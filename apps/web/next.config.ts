import type { NextConfig } from 'next';

const apiPublicUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api";

if (!process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn(
    "Neither NEXT_PUBLIC_API_URL nor NEXT_PUBLIC_API_BASE_URL is set; using default http://localhost:4000/api",
  );
}

const nextConfig: NextConfig = {


    productionBrowserSourceMaps: true,

    env: {
        NEXT_PUBLIC_API_URL: apiPublicUrl,
        NEXT_PUBLIC_API_BASE_URL: apiPublicUrl,
    },
    // Добавляем поддержку TypeScript для конфигурации
    typescript: {
        // Включаем проверку типов при сборке
        ignoreBuildErrors: false,
    },
    // Настройки для монорепозитория
    transpilePackages: ['@workspace/api', '@workspace/ui', '@workspace/api-client', '@workspace/theme'],

    // Настройки для изображений из S3
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's3.*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'sociopath-network-bucket.s3.eu-north-1.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
