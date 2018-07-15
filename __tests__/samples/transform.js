const through = require('through2')

const source = `
console.log('hello world')

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RpbmNoby9wcm9qZWN0cy90aW5jaG96NDkvcGFyY2VsLXBsdWdpbi10cmFuc2Zvcm1pZnkvX190ZXN0c19fL3NhbXBsZXMvaW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhIiwiZmlsZSI6Ii9ob21lL3RpbmNoby9wcm9qZWN0cy90aW5jaG96NDkvcGFyY2VsLXBsdWdpbi10cmFuc2Zvcm1pZnkvX190ZXN0c19fL3NhbXBsZXMvaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIn0=
`

module.exports = function (filename, opts) {
  return through(function (buf, enc, next) {
    this.push(source)
    next()
  })
}
