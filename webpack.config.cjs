const path = require('path');

module.exports = {
 mode: 'development',
 entry: {
   index: './src/script.js',
   saved: './src/saved.js',
 },
  output: {
   filename: '[name].bundle.js',
	path: path.resolve(__dirname, 'dist'),
  },
};