const withTM = require('next-transpile-modules')(['@wlq/wlq-model'])

module.exports = { ...withTM(), target: 'serverless', trailingSlash: true }
