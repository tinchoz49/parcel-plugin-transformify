const multipipe = require('multipipe')
const streamToPromise = require('stream-to-promise')
const str = require('string-to-stream')
const nodeResolve = require('resolve')
const sourceMappingURL = require('source-map-url')
const convert = require('convert-source-map')

const resolveFrom = (basedir, module) =>
  new Promise((resolve, reject) => {
    nodeResolve(module, { basedir }, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })

const getTransforms = pkg => {
  // filter transforms on module dependencies
  if (pkg && pkg.browserify && pkg.browserify.transform) {
    // In edge cases it may be a string
    return pkg.browserify.transform.filter(Boolean)
  }

  return null
}

const processTransforms = async ({
  filename,
  rootDir,
  contents,
  transforms,
  opts = {}
}) => {
  const pipes = await Promise.all(
    transforms.map(async elem => {
      let tr = elem

      if (Array.isArray(elem)) {
        tr = elem[0]
        opts = Object.assign({}, opts, elem[1] || {})
      }

      const module = await resolveFrom(rootDir, tr)

      return require(module)(filename, opts)
    })
  )

  return streamToPromise(multipipe(str(contents), ...pipes)).then(buffer =>
    buffer.toString('utf8')
  )
}

module.exports = Asset =>
  class extends Asset {
    async pretransform () {
      const pkg = await this.getPackage()
      const transforms = getTransforms(pkg)

      if (!transforms) {
        return super.pretransform()
      }

      const opts = {
        _flags: {
          debug: this.options.sourceMaps
        }
      }

      this.contents = await processTransforms({
        filename: this.name,
        rootDir: this.options.rootDir,
        contents: this.contents,
        transforms,
        opts
      })

      if (this.options.sourceMaps && sourceMappingURL.existsIn(this.contents)) {
        this.sourceMap = convert.fromComment(sourceMappingURL.getFrom(this.contents))
          .setProperty('sources', [this.relativeName])
          .toJSON()
      }

      // we should always remove the sourcemap generated from the transforms
      this.contents = sourceMappingURL.removeFrom(this.contents)

      return super.pretransform()
    }
  }
