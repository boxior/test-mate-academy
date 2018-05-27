const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const through2 = require('through2').obj;

function init(initSettings) {
  const isProduction = global.isProduction;

	const config = {
		src: ['./src/statics/images/**/*.png','./src/statics/images/**/*.jpg','./src/statics/images/**/*.gif','./src/statics/images/**/*.svg'],
		dist: isProduction? 'production/images/': 'dist/images/',
		watch: ['./src/statics/images/**/*.png','./src/statics/images/**/*.jpg','./src/statics/images/**/*.gif','./src/statics/images/**/*.svg']
	};

  const nameOfTask = isProduction? 'img:min': 'img:copy';

  const {
    gulp,
    watch,
    notify,
    plumber,
    gulpif,
    browserSync
  } = initSettings;
  
  initSettings.tasksNames.push(nameOfTask);


  

  
  if (!isProduction) {
	  gulp.task(nameOfTask, function () {
		  return gulp.src(config.src)
				  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				  .pipe(gulp.dest(config.dist))
				  .pipe(browserSync.stream());
	  });

    watch(config.watch, function () {
      gulp.start(nameOfTask);
    });

  } else {
	  gulp.task(nameOfTask, function () {
		  return gulp.src(config.src)
				  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
				  .pipe(imagemin({
					  progressive: true,
					  use: [pngquant()],
					  interlaced: true,
					  verbose: true
				  }))
				  .pipe(gulp.dest(config.dist))
				  .pipe(browserSync.stream());
	  });
  }
}

module.exports = {
  init: init
};