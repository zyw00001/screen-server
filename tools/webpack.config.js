import nodeExternals from 'webpack-node-externals';

const config = {
  mode: 'development',
  entry: {
    server: './src/server.js'
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          'stage-0',
          'react'
        ]
      }
    }]
  },
  externals: [nodeExternals()],
  target: 'electron-renderer',
  stats: {
    colors: true,
    timings: true,
  },
};

export default config;