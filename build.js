const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const typescript = require('rollup-plugin-typescript2')
const copy = require('rollup-plugin-copy')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const curVersion = JSON.stringify(require("./package.json").version)
const curYear = new Date().getFullYear()
const author = require("./package.json").author || ''
const contributors = require("./package.json").contributors || []
const description = require("./package.json").description || ''
const name = require("./package.json").name || ''

const production = !process.env.ROLLUP_WATCH;

function getBanner() {
  return `/** 
* ${name} ${curVersion} http://targomo.com
* ${description}
* (c) ${curYear} ${author}
*/`
}

const defaultPlugins = [
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: true
  }),
  resolve(),
  commonjs()
]


// --- BROWSER ---

// Regular bundle
rollup.rollup({
  input: './src/index.browser.ts',
  context: 'window',
  plugins: defaultPlugins,
}).then(bundle => {
  bundle.write({
    name: 'tgm',
    sourcemap: true,
    format: 'umd',
    banner: getBanner(),
    file: './dist/targomo-core.umd.js'
  })
})

let bannercomment0 = false;

// Minified bundle
rollup.rollup({
  input: './src/index.browser.ts',
  context: 'window',
  plugins: [
    ...defaultPlugins,
    uglify({
      output: {
        comments: function (node, comment) {
          var text = comment.value
          var type = comment.type
          if (type == "comment2") {
            // multiline comment
            const show = !bannercomment0
            bannercomment0 = true
            return show
          }
        }
      }
    }),
    copy({
      "./package.json": "dist/package.json",
      verbose: true
    })
  ],
}).then(bundle => {
  bundle.write({
    name: 'tgm',
    sourcemap: true,
    format: 'umd',
    banner: getBanner(),
    file: './dist/targomo-core.umd.min.js',
  })
})

// --- NODE ---

// Regular bundle
rollup.rollup({
  input: './src/index.node.ts',
  external: ['isomorphic-fetch'],
  plugins: defaultPlugins,
}).then(bundle => {
  bundle.write({
    name: 'tgm',
    sourcemap: true,
    format: 'umd',
    banner: getBanner(),
    file: './dist/targomo-core.js'
  })
})

