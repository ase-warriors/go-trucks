module.exports = {
  entry: './src/app.jsx',
  output: {
    filename: './static/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js.$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'env']
        }
      }
    ]
  }
}
