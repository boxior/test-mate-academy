function init(tasksInitSettings) {
  
  if(global.isProduction) return;
  const {gulp, watch, notify, plumber, server, gulpif, browserSync} = tasksInitSettings;
  
  tasksInitSettings.tasksNames.push('server');
  
  tasksInitSettings.gulp.task('server', function (done) {
    browserSync.init({
      server: {
        baseDir: "./dist/"
      },
      //proxy: "http://romsat.loc/local/layouts/dist/",
      //tunnel: true,
      host: 'localhost',
      port: 9000,
    });

	  done();
  });
}

module.exports = {
  init:init
};