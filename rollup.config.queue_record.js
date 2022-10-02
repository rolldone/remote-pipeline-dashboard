// import multiEntry from "rollup-plugin-multi-entry";
import path from 'path';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import rollup from './rollup.config';
import css from 'rollup-plugin-scss';

let baseOut = 'dist/queue_record';

rollup.input = [
  "src/QueueRecordApp.ts",
  "src/QueueRecordSchedulerApp.ts"
];

rollup.output = {
  dir: path.join(baseOut),
  format: 'esm',
  entryFileNames: "[name].js",
  chunkFileNames: "[name].js",
  sourcemap: true,
}

rollup.plugins = [
  ...rollup.plugins,
  css(),
  typescriptPlugin({
    tsconfig: 'tsconfig-queue_record.json',
    clean: false,
    typescript
  }),
]

export default rollup