const path = require('path');

module.exports = {
  entry: './background.js',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    fallback: {
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
      "fs": false
    }
  },
  externals: {
    "ws": "ws",
    },
  mode: 'production'
};
