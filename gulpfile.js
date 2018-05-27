const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

const isProduction = global.isProduction = process && !! process.env.NODE_ENV;

const defaultTasksInitSettings = {
	tasksNames: [],
	server: null,
	gulp: gulp,
	plumber,
	notify,
	watch,
	gulpif,
	browserSync,
};

const taskServer = require('./gulp/tasks/server');
const taskFontCopy = require('./gulp/tasks/font-copy');
const taskImgMin = require('./gulp/tasks/imgMin');
const taskPug = require('./gulp/tasks/pug');
const taskScss = require('./gulp/tasks/scss');
const taskWebpack = require('./gulp/tasks/webpack');
const taskSpritePng = require('./gulp/tasks/sprite-png');


// must to be first!
taskServer.init(defaultTasksInitSettings);

taskFontCopy.init(defaultTasksInitSettings);
taskImgMin.init(defaultTasksInitSettings);
taskPug.init(defaultTasksInitSettings);
taskScss.init(defaultTasksInitSettings);
taskWebpack.init(defaultTasksInitSettings);
taskSpritePng.init(defaultTasksInitSettings);


// перед сборкой dev удаляем production
// саму папку не удаляем, чтоб можно было настроить на деплой.
if(!global.isProduction) {
	gulp.task('clean', function() {
		gulp.src('production/*', {read: false})
				.pipe(clean());
	});

	defaultTasksInitSettings.tasksNames.push('clean');
}


gulp.task('default', defaultTasksInitSettings.tasksNames, function() {
	return gulp.src("./package.json")
			.pipe(notify(isProduction? 'production build': 'development build'));
});

