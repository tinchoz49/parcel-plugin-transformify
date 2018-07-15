/* eslint-env jest */
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const inputPath = `${__dirname}/samples/input.js`
const outputPath = `${__dirname}/samples/output.js`

describe('#initialization', () => {
  const transformifyPlugin = require('../index')
  const Bundler = require('parcel-bundler')
  let bundler = new Bundler(inputPath)
  transformifyPlugin(bundler)

  const jsAsset = 'parcel-plugin-transformify/lib/js-asset'
  const tsAsset = 'parcel-plugin-transformify/lib/ts-asset'

  it('transformify plugin should be a function', () =>
    expect(typeof transformifyPlugin).toBe('function'))

  it('transformify define TransformifyAsset as the js asset', () =>
    expect(bundler.parser.extensions['.js'].includes(jsAsset)).toBeTruthy())
  it('transformify define TransformifyAsset as the jsx asset', () =>
    expect(bundler.parser.extensions['.jsx'].includes(jsAsset)).toBeTruthy())
  it('transformify define TransformifyAsset as the es6 asset', () =>
    expect(bundler.parser.extensions['.es6'].includes(jsAsset)).toBeTruthy())
  it('transformify define TransformifyAsset as the jsm asset', () =>
    expect(bundler.parser.extensions['.jsm'].includes(jsAsset)).toBeTruthy())
  it('transformify define TransformifyAsset as the mjs asset', () =>
    expect(bundler.parser.extensions['.mjs'].includes(jsAsset)).toBeTruthy())
  it('transformify define TransformifyAsset as the tsx asset', () =>
    expect(bundler.parser.extensions['.tsx'].includes(tsAsset)).toBeTruthy())
})

describe('#transform', () => {
  const Bundler = require('parcel-bundler')
  const transformifyPlugin = require('../index')

  it('should apply the browserify transform with sourcemap', async () => {
    expect.assertions(2)

    let bundler = new Bundler(inputPath, {
      watch: false,
      cache: false
    })

    transformifyPlugin(bundler)

    const result = await bundler.bundle()
    const output = await readFile(outputPath, 'utf8')
    expect(result.entryAsset.generated.js.trim()).toEqual(output.trim())
    expect(result.entryAsset.generated.map).not.toBeNull()
  })

  it('should apply the browserify transform without sourcemap', async () => {
    expect.assertions(2)

    let bundler = new Bundler(inputPath, {
      watch: false,
      cache: false,
      sourceMaps: false
    })

    transformifyPlugin(bundler)

    const result = await bundler.bundle()
    const output = await readFile(outputPath, 'utf8')
    expect(result.entryAsset.generated.js.trim()).toEqual(output.trim())
    expect(result.entryAsset.generated.map).toBeNull()
  })
})
