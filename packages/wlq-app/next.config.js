const withTM = require('next-transpile-modules')([
  '@wlq/wlq-model',
  '@wlq/wlq-api',
])

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...withTM(),
  target: 'serverless',
  trailingSlash: true,
})
