const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const typescript = require('rollup-plugin-typescript2')
const copy = require('rollup-plugin-copy')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const paths = require('path')
const fsExtra = require('fs-extra')

const curVersionString = require("./package.json").version
const curVersion = JSON.stringify(require("./package.json").version)
const curYear = new Date().getFullYear()
const author = require("./package.json").author || ''
const contributors = require("./package.json").contributors || []
const description = require("./package.json").description || ''
const name = require("./package.json").name || ''

const which = 'core'
const distFolder = `./dist/${which}/`
const targetReleaseFolder = which
const targetFile = `targomo-${which}`

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

async function buildLibraries() {

  fsExtra.ensureDirSync(distFolder)


  // --- BROWSER ---

  // Regular bundle
  await rollup.rollup({
    input: './src/index.browser.ts',
    context: 'window',
    plugins: defaultPlugins,
  }).then(bundle => {
    bundle.write({
      name: 'tgm',
      sourcemap: true,
      format: 'umd',
      banner: getBanner(),
      file: paths.join(distFolder, 'targomo-core.umd.js')
    })
  })

  let bannercomment0 = false;

  // Minified bundle
  await rollup.rollup({
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
        "./package.json": paths.join(distFolder, "package.json"),
        verbose: true
      })
    ],
  }).then(bundle => {
    bundle.write({
      name: 'tgm',
      sourcemap: true,
      format: 'umd',
      banner: getBanner(),
      file: paths.join(distFolder, 'targomo-core.umd.min.js'),
    })
  })

  // --- NODE ---

  // Regular bundle
  await rollup.rollup({
    input: './src/index.node.ts',
    external: ['isomorphic-fetch'],
    plugins: defaultPlugins,
  }).then(bundle => {
    bundle.write({
      name: 'tgm',
      sourcemap: true,
      format: 'umd',
      banner: getBanner(),
      file: paths.join(distFolder, 'targomo-core.js'),
    })
  })
}

function prepareReleases() {
  const releaseFolder = paths.resolve(__dirname, 'dist', 'releases', targetReleaseFolder)

  fsExtra.ensureDirSync(releaseFolder)

  // const postfixes = [['', ''], ['', '.min'], ['-full', ''], ['-full', '.min']]
  const postfixes = [['', ''], ['', '.min']]
  postfixes.forEach((pair) => {
    const prefix = pair[0]
    const postfix = pair[1]
    fsExtra.copySync(paths.resolve(__dirname, distFolder, targetFile + `${prefix}.umd${postfix}.js`), paths.join(releaseFolder, `latest${prefix}${postfix}.js`))
    fsExtra.copySync(paths.resolve(__dirname, distFolder, targetFile + `${prefix}.umd${postfix}.js`), paths.join(releaseFolder, `${curVersionString}${prefix}${postfix}.js`))
  })  
}

async function buildAll() {
  await buildLibraries()
  await prepareReleases()
}

buildAll()