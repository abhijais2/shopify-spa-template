const path = require('path')
const webpack = require('webpack')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const merge = require('webpack-merge')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',

  devServer: {
    port: parseInt(process.env.APP_PORT) + 1,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': `http://${process.env.APP_PUBLIC_HOST}:${process.env.APP_PORT}`
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
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
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
