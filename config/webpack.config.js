const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js', // relative to root
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
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
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'postcss.config.js',
              },
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // all options are optional
    //   filename: 'module-notification.css',
    //   chunkFilename: '[id].css',
    //   ignoreOrder: false, // Enable to remove warnings about conflicting order
    // }),
  ],
  // optimization: {
  //   minimize: IS_PROD,
  //   minimizer: [new OptimizeCSSAssetsPlugin({})],
  // },
};
