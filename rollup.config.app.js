// import multiEntry from "rollup-plugin-multi-entry";
import notify from 'rollup-plugin-notify';
import multiInput from 'rollup-plugin-multi-input';
import babel from 'rollup-plugin-babel';
import html from "rollup-plugin-html";
import { string } from "rollup-plugin-string";
import scss from 'rollup-plugin-scss';
import css from "rollup-plugin-import-css";
import copy from 'rollup-plugin-copy'
import inject from '@rollup/plugin-inject';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
import urlResolve from 'rollup-plugin-url-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { baseUrl } from 'rollup-plugin-base-url';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import svg from 'rollup-plugin-svg-import';
import json from "@rollup/plugin-json";

let baseOut = 'dist/app';
export default {
  input: [
    "src/App.ts",
  ],
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
    // string({
    //   // Required to be specified
    //   include: "**/*.html",
    // }),
    multiInput(),
    typescriptPlugin({
      tsconfig: './tsconfig-app.json',
      clean: false,
      typescript
    }),
    scss({
      // include: ["/**/*.css", "/**/*.scss", "/**/*.sass"],
      output: path.join(baseOut, "/css/style.css"),
      failOnError: false,
      // Import library as global use all scss
      // prefix: `@import "src/base/flexbox.scss";`
    }),
    css(),
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
  ],
  output: {
    dir: path.join(baseOut),
    format: 'esm',
    entryFileNames: "[name].js",
    chunkFileNames: "[name].js",
    sourcemap: true,
  }
}