
function init(initSettings) {
	const isProduction = global.isProduction;
  
  const config = {
    src: './src/statics/fonts/**/*',
    dist: isProduction? './production/fonts/': './dist/fonts/',
    watch: ['./src/statics/fonts/**/*']
  };
  
  const nameOfTask = 'font:copy';
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
      .pipe(gulp.dest(config.dist))
      .pipe(browserSync.stream());
  });
  
  if (!isProduction) {
    // fonts
    watch(config.watch, function () {
      gulp.start(nameOfTask);
    });
  }
}

module.exports = {
  init: init
};