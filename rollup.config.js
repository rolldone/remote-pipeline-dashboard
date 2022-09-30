import notify from 'rollup-plugin-notify';
import multiInput from 'rollup-plugin-multi-input';
import html from "rollup-plugin-html";
import css from "rollup-plugin-import-css";
import inject from '@rollup/plugin-inject';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import urlResolve from 'rollup-plugin-url-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from 'rollup-plugin-svg-import';
import json from "@rollup/plugin-json";

export default {
  plugins: [
    svg({
      // process SVG to DOM Node or String. Default: false
      stringify: false
    }),
    notify(),
    inject({
      // '$': 'jQuery',
      exclude: ['**/*.html', "**/*.ts", "**/*.scss", "**/*.css", "**/*.json"],
    }),
    html(),
    multiInput(),
    json(),
    nodeResolve({
      browser: true
    }),
    urlResolve(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: [],  // Default: undefined
      exclude: [],  // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js', '.html'],  // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: true,  // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      ignore: ['conditional-runtime-dependency']
    }),
    // copy({
    //   targets: [
    //     { src: 'import-map.json', dest: path.join(baseOut) },
    //     { src: ['system'], dest: path.join(baseOut) }
    //   ],
    //   hook: 'writeBundle',
    //   flatten: false,
    //   copyOnce: true
    // }),
    // baseUrl({
    //   url: '/public/dashboard', // the base URL prefix; optional, defaults to /
    //   staticImports: true, // also rebases static `import _ from "…"`; optional, defaults to false
    // }),
  ]
}