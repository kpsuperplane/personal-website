require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [
  new ExtractTextPlugin('style.css', {
      allChunks: true
  })
];

module.exports = {
  entry: [
    './source/index.js',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: [/\.scss$/i],
        loader: ExtractTextPlugin.extract('css!sass')
      },{
          test: /\.(png|jpe?g|gif|svg)$/,
          loaders: [
              'file?name=/img/[name].[ext]',
              //'image-webpack'
          ]
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.es6'],
    alias: {
        "TweenLite": path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
        "TweenMax": path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
        "TimelineLite": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
        "TimelineMax": path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
        "ScrollToPlugin": path.resolve('node_modules', 'gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
        "ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
        "animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
        "debug.addIndicators": path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
    }
  },
  output: {
    path: './assets/build',
    filename: 'index.js',
    publicPath: './'
  },
  plugins,
};
