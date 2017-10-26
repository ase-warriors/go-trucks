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
      }, {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  }
}
