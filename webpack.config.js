const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'Progressive Web Application',
			favicon: './src/favicon.png',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
			},
		}),		
		new WebpackPwaManifest({
			name: 'My Progressive Web App',
			short_name: 'MyPWA',
			description: 'My awesome Progressive Web App!',
			background_color: '#ffffff',
			theme_color: '#2196F3',
			crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
			ios: true,
			icons: [
				{
					src: path.resolve('src/apple-touch-icon.png'),
					sizes: [120, 180, 167, 152, 192],
					ios: true,
				},
				{
					src: path.resolve('src/favicon.png'),
					size: [32, 64, 96, 128, 192, 512]
				}
			]
		}),
		new WorkboxWebpackPlugin.GenerateSW({
			importWorkboxFrom: 'local',
			clientsClaim: true,
			skipWaiting: true,
		}),
	],
	devtool: prod ? false : 'source-map'
};
