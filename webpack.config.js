const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

const babelLoaderConfiguration = {
  test: /\.(ts|tsx|js|jsx)$/,
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'App.web.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/@react-native'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', {runtime: 'automatic'}],
        '@babel/preset-typescript',
      ],
      plugins: ['react-native-web', '@babel/plugin-transform-runtime'],
    },
  },
};

module.exports = {
  entry: path.resolve(appDirectory, 'index.web.js'),
  output: {
    path: path.resolve(appDirectory, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': 'react-native-web',
      'react-native-reanimated': path.resolve(appDirectory, 'src/__mocks__/react-native-reanimated.js'),
      'react-native-screens': path.resolve(appDirectory, 'src/__mocks__/react-native-screens.js'),
      '@react-native-async-storage/async-storage': path.resolve(appDirectory, 'src/__mocks__/async-storage.js'),
    },
  },
  module: {
    rules: [babelLoaderConfiguration],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'public/index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(appDirectory, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  mode: 'development',
  devtool: 'source-map',
};
