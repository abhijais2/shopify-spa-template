const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

require('dotenv').config()

module.exports = {
  entry: {
    app: [
      './client/index.js'
    ]
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '..', 'client'),
      '~': path.resolve(__dirname, '..')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-async-generator-functions'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: [/flag-icon-css/],
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        include: [/flag-icon-css/],
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:7].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '..', 'static'),
      to: path.join(__dirname, '..', 'dist')
    }]),
    new HtmlWebpackPlugin({
      template: '!!raw-loader!index.html',
      filename: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({})
  ],
  externals: {
    ShopifyApp: 'ShopifyApp'
  }
}
