import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli'
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: false,
    esbuild: {
      minify: false,
      target: 'es2020'
    }
  },
  externals: [
    '@tnnevol/robot-ding',
    'axios'
  ]
})