const css = require('sheetify')
const test = require('./module')

const box1 = css`
  :host {
    background: red;
    width: 100px;
    height: 100px;
  }
`

const box2 = css`
  :host {
    background: blue;
    width: 100px;
    height: 100px;
  }
`

document.getElementById('box1').classList.add(box1)
document.getElementById('box2').classList.add(box2)
