// import multiEntry from "rollup-plugin-multi-entry";
import path from 'path';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import rollup from './rollup.config';
import scss from 'rollup-plugin-scss';

let baseOut = 'dist/webhook';

rollup.input = "src/WebhookApp.ts";

rollup.output = {
  dir: path.join(baseOut),
  format: 'esm',
  entryFileNames: "[name].js",
  chunkFileNames: "[name].js",
  sourcemap: true,
}

rollup.plugins = [
  ...rollup.plugins,
  typescriptPlugin({
    tsconfig: 'tsconfig-webhook.json',
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