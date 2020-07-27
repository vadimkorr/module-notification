const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ENV = process.env.NODE_ENV.trim();
const IS_PROD = ENV === 'prod'; // 'dev'
const BUILD_DIR = IS_PROD
  ? path.resolve(__dirname, '../dist')
  : path.resolve(__dirname, '../docs/dist');

console.log('ENVIRONMENT', ENV);

module.exports = {
  entry: './src/index.js', // relative to root
  output: {
    filename: 'module-notification.js',
    path: BUILD_DIR,
    library: 'MNModule',
    libraryExport: 'default',
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: './babel.config.js',
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: '../',
              // hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'module-notification.css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
  optimization: {
    minimize: IS_PROD,
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};
