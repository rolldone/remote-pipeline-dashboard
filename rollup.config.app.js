// import multiEntry from "rollup-plugin-multi-entry";
import path from 'path';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import rollup from './rollup.config';
import scss from 'rollup-plugin-scss';
import css from 'rollup-plugin-scss';
import filesize from 'rollup-plugin-filesize';
import multiInput from 'rollup-plugin-multi-input';
import sizes from "rollup-plugin-sizes";

const maxSize = 512 * 1024; // 512 KB in bytes

let baseOut = 'dist/app';

// rollup.input = "src/App.ts";
rollup.input = ["src/App.ts"];

rollup.output = {
  ...rollup.output,
  dir: path.join(baseOut),
  format: 'esm',
  entryFileNames: "[name].js",
  chunkFileNames: "[name].js",
  // chunkFileNames: "chunk-[hash].js",
  sourcemap: true,
}

rollup.treeshake = true;

rollup.plugins = [
  ...rollup.plugins,
  scss({
    // include: ["/**/*.css", "/**/*.scss", "/**/*.sass"],
    output: path.join(baseOut, "/css/style.css"),
    failOnError: false,
    // Import library as global use all scss
    // prefix: `@import "src/base/flexbox.scss";`
  }),
  typescriptPlugin({
    tsconfig: 'tsconfig-app.json',
    clean: false,
    typescript
  }),
  multiInput(),
  // filesize({
  //   showBrotliSize: true,
  //   showMinifiedSize: false,
  //   showGzippedSize: false,
  //   max: maxSize,
  // }),
  sizes()
]

export default rollup