import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

const curVersion = JSON.stringify(require("./package.json").version)
const curYear = new Date().getFullYear()
const author = require("./package.json").author || ''
const contributors = require("./package.json").contributors || []
const description = require("./package.json").description || ''
const name = require("./package.json").name || ''

const production = !process.env.ROLLUP_WATCH;

function getBanner() {
  return `// ${name} ${curVersion} http://targomo.com
// ${description}
// (c) ${curYear} ${author}`
}

export default {
  input: './src/index.ts',
  context: 'window',
  output: [{
    file: 'dist/targomo-core.js',
    format: 'es',
    name: 'tgm',
    banner: getBanner(),
    sourcemap: true
  },{
    file: 'dist/targomo-core.min.js',
    format: 'iife',
    name: 'tgm',
    banner: getBanner()
  }],
	plugins: [
    typescript({ 
        tsconfig: './tsconfig.json' ,
        useTsconfigDeclarationDir: true
    }),
		// resolve(), // tells Rollup how to find date-fns in node_modules
		// commonjs(), // converts date-fns to ES modules
    // uglify({
    //   output: {
    //     comments: function(node, comment) {
    //         var text = comment.value;
    //         var type = comment.type;
    //         if (type == "comment2") {
    //             // multiline comment
    //             return /@preserve|@license|@cc_on/i.test(text);
    //         }
    //     }
    //   }
    // }), 
    copy({
      "./package.json": "dist/package.json",
      verbose: true
  })
	],
	sourceMap: true
};