const Asset = require('parcel-bundler/src/assets/JSAsset')
const transformifyMixin = require('./transformify-asset')

class JSAsset extends transformifyMixin(Asset) {}

module.exports = JSAsset
