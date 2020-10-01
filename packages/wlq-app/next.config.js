const withTM = require('next-transpile-modules')([
  '@wlq/wlq-model',
  '@wlq/wlq-api',
])

module.exports = { ...withTM(), target: 'serverless', trailingSlash: true }
