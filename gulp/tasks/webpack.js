const webpackStream = require('webpack-stream');
const gutil = require('gulp-util');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const notifier = require('node-notifier');

let statsLog      = { // для красивых логов в консоли
	colors: true,
	reasons: true
};

function init(initSettings) {
	const isProduction = global.isProduction;

	const config = {
		src: 'src/entries/*.js',
		webpack: {
			output: {
				filename: '[name].js'
			},
			watch: !isProduction,
			devtool: isProduction? false: 'cheap-eval-source-map',
			module: {
				rules: [
					{
						test: /\.js?$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ["es2015"]
							}
						}
					},
					{
						test: /\.(html)$/,
						use: {
							loader: 'html-loader',
							options: {
								attrs: [':data-src']
							}
						}
					}
				]
			},
			plugins: [
				new webpack.ProvidePlugin({
					$: "jquery",
					jQuery: "jquery"
				})
				//new webpack.NoErrorsPlugin()// is deprecated. Use NoEmitOnErrorsPlugin instead.
			]
		},
		dist: isProduction? './production/js': './dist/js'
	};

	const nameOfTask = 'webpack:build';

	const {
		tasksNames,
		gulp,
		watch,
		notify,
		plumber,
		gulpif,
		browserSync
	} = initSettings;

	tasksNames.push(nameOfTask);

	if(isProduction) {
		config.webpack.plugins.push(new webpack.optimize.UglifyJsPlugin({
			minimize: true
		}));
	}

	gulp.task(nameOfTask, function(callback) {
		let firstBuildReady;

		gulp.src(config.src)
				.pipe(named())
				.pipe(webpackStream(config.webpack, null, wpCallBack))
				.pipe(gulp.dest(config.dist))
				.pipe(browserSync.stream({match: '**/*.js'}))
				.on('data', function() {
					if(firstBuildReady) {
						firstBuildReady = false;
						callback();
					}
				});

		function wpCallBack(error, stats) {
			if(firstBuildReady === undefined) {
				firstBuildReady = true;
			}


			if (error) {
				onError(error);
			} else if ( stats.hasErrors() ) {
				onError( stats.toString(statsLog) );
			} else {
				onSuccess( stats.toString(statsLog) );
			}
		}

		function onError(error) {
			let formatedError = new gutil.PluginError('webpack', error);

			notifier.notify({
				title: `Error: ${formatedError.plugin}`,
				message: 'Ошибка!!!'
			});

			gutil.log('[webpack]', formatedError.message);

			if(firstBuildReady === undefined) {
				firstBuildReady = false;
				callback(formatedError);
			}

		}

		function onSuccess(detailInfo) {
			gutil.log('[webpack]', detailInfo);
		}
	});
}

module.exports = {init};