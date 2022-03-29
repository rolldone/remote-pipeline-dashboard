## Description
rollup-system-js. This is for easy use js module for develope on front area.

```
npm install
npm run watch
```
## import-map.json
Systemjs have config file import-map.json as base path smart import feature from systemjs. This basepath "dist" must following the path folder where is file compiled from load on index.html file.
```
{
  "imports": {
    "app::/": "/dist/",
    "Boot": "/dist/Boot.js"
  },
  "scopes": {}
}
```
## rollup.config.js
It will compile and copy asset, config to dist folder
```
import notify from 'rollup-plugin-notify';
import multiInput from 'rollup-plugin-multi-input';
import babel from 'rollup-plugin-babel';
import html from "rollup-plugin-html";
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy'
import path from 'path';

let baseOut = 'example/dist';
export default {
  input: 'src/**/**/*.js',
  plugins: [scss({
    // include: ["/**/*.css", "/**/*.scss", "/**/*.sass"],
    output: path.join(baseOut, "/css/style.css"),
    failOnError: true,
    // Import library as global use all scss
    // prefix: `@import "src/base/flexbox.scss";`
  }), notify(), babel({
    babelrc: false,
    "presets": [["@babel/env"], ["minify", {
      "builtIns": false
    }]],
    "plugins": ["@babel/plugin-syntax-dynamic-import", ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "guest": "./src/guest"
      }
    }]]
  }),
  copy({
    targets: [
      { src: 'import-map.json', dest: path.join(baseOut) },
      { src: ['system'], dest: path.join(baseOut) }
    ]
  })
  , multiInput(), html(), json()],
  output: {
    dir: path.join(baseOut),
    format: 'system',
    sourcemap: true,
  }
}

```
For running example, install browser-sync first
```
npm install browser-sync -g
cd example && browser-sync start --server
```