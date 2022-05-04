import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

const curVersion = JSON.stringify(require('./package.json').version)
const curYear = new Date().getFullYear()
const author = require('./package.json').author || ''
const contributors = require('./package.json').contributors || []
const description = require('./package.json').description || ''
const name = require('./package.json').name || ''

const production = !process.env.ROLLUP_WATCH

function getBanner() {
  return `// ${name} ${curVersion} http://targomo.com
// ${description}
// (c) ${curYear} ${author}`
}

export default {
  input: './src/index.ts',
  context: 'window',
  output: [
    {
      file: 'dist/targomo-core.js',
      format: 'es',
      name: 'tgm',
      banner: getBanner(),
      sourcemap: true,
    },
    {
      file: 'dist/targomo-core.min.js',
      format: 'iife',
      name: 'tgm',
      banner: getBanner(),
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),

    copy({
      './package.json': 'dist/package.json',
      verbose: true,
    }),
  ],
  sourceMap: true,
}
