var packageJSON = require('../package.json');
var name = packageJSON["name"];

module.exports = {
  entry: {
    js:"./src/main.js",
  },
  output: {
    path: "./dist",
    filename: name+".bundle.js",
    libraryTarget: 'umd'
  },
  externals:{
    'react':'react',
    'react-dom':'react-dom'
  },
  module: {
    loaders: [],
  },
  resolve: {
    extensions: [
      '',
      '.js',
    ],
  }
};
