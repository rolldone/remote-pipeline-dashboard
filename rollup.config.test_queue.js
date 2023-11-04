// import multiEntry from "rollup-plugin-multi-entry";
import path from 'path';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import rollup from './rollup.config';
import css from 'rollup-plugin-import-css';
import scss from 'rollup-plugin-scss';

let baseOut = 'dist/test_queue';

rollup.input = [
  "src/TestQueueApp.ts",
  "src/DemoClientApp.ts"
];

rollup.output = {
  ...rollup.output,
  dir: path.join(baseOut),
  format: 'esm',
  entryFileNames: "[name].js",
  chunkFileNames: "[name].js",
  sourcemap: true,
}

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
    tsconfig: 'tsconfig-test_queue.json',
    clean: false,
    typescript
  }),
  // scss({
  //   // include: ["/**/*.css", "/**/*.scss", "/**/*.sass"],
  //   output: path.join(baseOut, "/css/style.css"),
  //   failOnError: false,
  //   // Import library as global use all scss
  //   // prefix: `@import "src/base/flexbox.scss";`
  // }),
]

export default rollup