const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: "./src/index.tsx", // Point to main file
	output: {
		path: __dirname + "/assets/build",
		filename: "bundle.js",
		publicPath: "/assets/build/",
		chunkFilename: '[name].js',
	},
	resolve: {
		extensions: [ '.js', '.jsx', '.ts', '.tsx' ]
	},
	performance: {
		hints: false
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loaders: [ 'babel-loader', 'ts-loader' ],
				exclude: /node_modules/
			}, {
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}, {
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}, {
				test: /\.s?css$/,
				loaders: ["style-loader", "css-loader", "sass-loader"],
				exclude: /node_modules/
			}, {
				test: /\.(jpe?g|png|gif|svg|mp4)$/i,
				loaders: [
					'file-loader?hash=sha512&digest=hex&name=[name].[ext]',
					{
						loader: 'image-webpack-loader?bypassOnDebug&interlaced=false',
						query: {
							mozjpeg: {
								progressive: true,
							},
							gifsicle: {
								interlaced: false,
							},
							optipng: {
								optimizationLevel: 4,
							},
							pngquant: {
								quality: '75-90',
								speed: 3,
							},
						}
					}
				],
			}
		]
	},
	devServer: {
		contentBase: "src/",
		historyApiFallback: true
	},
	plugins: [
		new CleanWebpackPlugin(
			["dist"], {
				verbose: true
			}
		)
		//,new UglifyJSPlugin()
	]
};
