const gulpSpritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');

function init(initSettings) {
	const isProduction = global.isProduction;

  const config = {
    src: 'src/statics/sprite-png-icons/*.png',
    dist: isProduction? 'production/images/sprites/': 'dist/images/sprites/',
    scss: 'src/utils/sprites/',
    template: 'gulp/templates/scss.sprite.mustache',
    watch: ['src/statics/sprite-png-icons/*.png']
  };
  
  const nameOfTask = 'sprite:png';

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
  
  gulp.task(nameOfTask, function (done) {
    var params = {
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      cssName: 'sprite-png.scss',
      padding: 25,
      cssFormat: 'scss',
      algorithm: 'binary-tree',
      cssTemplate: config.template
    };
  
    var spriteData = gulp.src(config.src)
      .pipe(gulpSpritesmith(params));
  
    spriteData.img
      .pipe(buffer())
      .pipe(gulpif(isProduction, imagemin()))
      .pipe(gulp.dest(config.dist))
      .pipe(browserSync.stream());
  
    spriteData.css
      .pipe(gulp.dest(config.scss));
  
    done();
  });
  
  if (!global.isProduction) {
    // fonts
    watch(config.watch, function () {
      gulp.start(nameOfTask);
    });
  }
}

module.exports = {
  init: init
};