const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const flatten = require('gulp-flatten');

function init(initSettings) {
	const isProduction = global.isProduction;
  
  const config = {
    src: ['./src/entries/*.scss'],
    dist: isProduction? './production/css/': './dist/css/',
    watch: ['./src/**/*.scss']
  };
  
  const nameOfTask = 'scss:build';
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
  
  gulp.task(nameOfTask, function () {
    return gulp.src(config.src)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(gulpif(!isProduction, sourcemaps.init()))
      .pipe(sass({
        cache_location: './cache',
        cache: true,
        outputStyle: isProduction? 'compressed': 'expanded',
        precision: 3
      }).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulpif(!isProduction, sourcemaps.write()))
      .pipe(gulp.dest(config.dist))
      .pipe(browserSync.stream({match: '**/*.css'}));
  });
  
  if (!isProduction) {
    watch(config.watch, function () {
      gulp.start(nameOfTask);
    });
  }
}

module.exports = {
  init: init
};