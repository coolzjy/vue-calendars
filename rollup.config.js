import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'

const config = {
  input: 'src/index.js',
  plugins: [vue(), buble()],
  output: {
    file: 'dist/index.common.js',
    format: 'cjs'
  }
}

export default config
