import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sucrase from '@rollup/plugin-sucrase'
import css from "rollup-plugin-css-only"
import postcss from 'rollup-plugin-postcss'
import linaria from "@linaria/rollup"
import replace from '@rollup/plugin-replace'
import livereload from "rollup-plugin-livereload"
import { terser } from 'rollup-plugin-terser'

import {readFileSync} from 'fs'

const production = !process.env.ROLLUP_WATCH;

export default {
  external: ['object-assign'],
  input: 'src/main.jsx',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
    globals: {
      'object-assign': 'Object.assign'
    }
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    }),

    sucrase({
      exclude: ['node_modules/**', '**/*.css'],
      transforms: ['jsx', 'typescript']
    }),
    linaria({
      exclude: ['node_modules/**']
    }),
    css({output: 'bundle.css'}),
    //postcss({extract: true}),

    production && terser(),
    !production && serve(),
    !production && livereload({
      watch: 'public'
    })
  ]
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}
