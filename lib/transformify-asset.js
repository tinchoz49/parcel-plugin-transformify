const multipipe = require('multipipe')
const streamToPromise = require('stream-to-promise')
const str = require('string-to-stream')
const nodeResolve = require('resolve')
const path = require('path')

const resolveFrom = (basedir, module) =>
  new Promise((resolve, reject) =>
    nodeResolve(module, { basedir }, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(`${path.dirname(res)}/transform`)
      }
    })
  )

const getTransforms = ({ package: pkg }) => {
  // filter transforms on module dependencies
  if (pkg && pkg.browserify && pkg.browserify.transform) {
    // In edge cases it may be a string
    return pkg.browserify.transform.filter(Boolean)
  }

  return null
}

const processTransforms = async ({
  filename,
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

      const module = await resolveFrom(filename, tr)
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
      const transforms = getTransforms(this)

      if (!transforms) {
        return super.pretransform()
      }

      const opts = {
        _flags: {
          debug: true
        }
      }

      this.contents = await processTransforms({
        filename: this.name,
        contents: this.contents,
        transforms,
        opts
      })

      return super.pretransform()
    }
  }
