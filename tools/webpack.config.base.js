var packageJSON = require('../package.json');
var name = packageJSON["name"];

module.exports = {
  entry: {
    js:"./src/main.js",
  },
  output: {
    path: "./dist",
    filename: name+".bundle.js"
  },
  module: {
    loaders: [],
  },
  resolve: {
    extensions: [
      '',
      '.js',
    ],
  },
  externals:{
    'react':'React',
    'react-dom':'ReactDOM'
  }
};
