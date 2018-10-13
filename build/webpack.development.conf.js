const path = require('path')
const webpack = require('webpack')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const merge = require('webpack-merge')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',

  devServer: {
    port: parseInt(process.env.PORT) + 1,
    open: true,
    hot: true,
    historyApiFallback: false,
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`,
      '/adaptor': `http://localhost:${process.env.PORT}`
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|vue|json)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [ path.resolve(__dirname, '..', 'client') ],
        options: {
          formatter: eslintFriendlyFormatter
        }
      }
    ]
  },

  devtool: '#eval-source-map',

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin()
    // new StyleLintPlugin({
    //   files: [ 'client/**/*.vue', 'client/**/*.css', 'client/**/*.scss' ]
    // })
  ]
})
