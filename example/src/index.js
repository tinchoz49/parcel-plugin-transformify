const h = require('hyperscript')
const hyperx = require('hyperx')
const css = require('sheetify')
const hx = hyperx(h)

const prefix = css`
  :host > div {
    width: 100px;
    height: 100px;
  }

  :host > .red {
    background: red;
  }

  :host > .blue {
    background: blue;
  }
`

const tree = hx`<div class="${prefix}">
  <div class="red"></div>
  <div class="blue"></div>
</div>`

document.getElementById('root').innerHTML = tree.outerHTML
