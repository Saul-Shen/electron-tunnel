const buidMyPackage = require('build-my-package')
const path = require('path')

const { buildCommonjs } = buidMyPackage

buildCommonjs({
  entry: path.join(__dirname, './src'),
  language: 'typescript'
})
