const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.tsx'],
  // Enable importing JS and TSX files without identifying their extension.
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },

  // Set output directory.
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  // Strongly consider adding cleanwebpack plugin here to clean build directory.
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { targets: 'defaults' }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname),
      publicPath: '/'
    },
    // Can change the proxy below as needed.
    proxy: {
      '/api': 'http://localhost:3000',
    },
    compress: true,
    port: 8080,
  },
  // consider putting template back in htmlwebpackplugin if needed.
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // filename: './public/index.html',
      // inject: 'body'
    })
  ],
};
