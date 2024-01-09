const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true
}

module.exports = withBundleAnalyzer(withNextIntl(nextConfig))
