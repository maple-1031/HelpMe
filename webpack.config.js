var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  entry: "./js/content_script.js",
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }]
    },
    {
      test: /\.css/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { url: false }
        }
      ]
    }]
  },
  output: {
    path: __dirname + "/src/",
    filename: "content_script.bundle.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "src"),
    }
  }
};
