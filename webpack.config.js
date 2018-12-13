const path = require('path');

module.exports = {
  entry: './src/action-decider.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist')
  }
};