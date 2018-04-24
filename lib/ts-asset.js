const Asset = require('parcel-bundler/src/assets/TypeScriptAsset')
const transformifyMixin = require('./transformify-asset')

class TSAsset extends transformifyMixin(Asset) {}

module.exports = TSAsset
