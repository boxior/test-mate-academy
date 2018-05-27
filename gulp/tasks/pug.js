/**
 * Created by Владыка Макс on 16.09.2017.
 */
const pug = require('gulp-pug');
const through2 = require('through2').obj;
const fs = require('fs');
const path = require('path');
const flatten = require('gulp-flatten');
const _ = require('lodash');

var tree = {};

function updateTree(filepath) {
  
  tree[filepath] = getFileDependencies(filepath);
}

function getFileContent(filepath) {
  
  try {
    return fs.readFileSync(filepath).toString();
  } catch (err) {
    return false;
  }
}

function getFileDependencies(filepath) {
  var dependencies = [];
  var skip = -1;
  var content = getFileContent(filepath);
  
  
  if(!content) throw new Error('ошибка подключения файла ' + filepath);
  
  content.split('\n').forEach((line) => {
    const comment = /\/\//.exec(line);
  if (comment) {
    skip = comment.index;
    return;
  }
  const whiteSpaces = /^\s*/.exec(line);
  if (whiteSpaces[0].length <= skip || /^\S/.test(line)) {
    skip = -1;
  }
  const keyword = /(?:^\s*)(?:include|extends)(\b.*\b)(?:\.pug|\s*$)/g.exec(line);
  
  if (keyword && skip === -1) {
    var dir = path.dirname(filepath);
    var dependence = (keyword[1]).trim();
    var dependencePath = path.join(dir, dependence);
  
    if(path.extname(filepath) === '.js' || path.extname(filepath) === '.css') return [];
    console.log(filepath);
    
    dependencePath = path.join(dir, dependence).replace(/\.pug\s*/, '') + '.pug';
    
    //console.log('---+ ' + dependencePath + ' ----')
    dependencies.push(dependencePath);
    
    getFileDependencies(dependencePath).forEach((p) => {
      // todo: проверять может зависимость уже есть
      dependencies.push(p);
    });
    //dependencies.concat()
  }
});
  
  return dependencies;
}

function init(initSettings) {
  const isProduction = global.isProduction;

	const config = {
		src: ['./src/pages/**/*.pug', './src/entries/*.pug'],
		dist: isProduction? './production/': './dist/',
		watch: {
			pug: ['./src/**/*.pug', './src/entries/*.pug'],
			html: ['./dist/*.html']
		}
	};

  const nameOfTask = 'pug:build';
  const {
    gulp,
    watch,
    notify,
    plumber,
    gulpif,
    browserSync
  } = initSettings;
  
  initSettings.tasksNames.push(nameOfTask);
  

  
  if(!global.isProduction) {
    // dev build
	  gulp.task(nameOfTask, function () {

		  return gulp.src(config.src)
				  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message  error.file %>")}))
				  .pipe(through2(function (file, enc, callback) {
					  var filepath = file.base + file.relative;
					  var dependencies = tree[filepath];

					  if (!dependencies ||
							  filepath == global.changedTempalteFile ||
							  (tree[filepath] && tree[filepath].indexOf(global.changedTempalteFile) != -1)) {

						  updateTree(filepath);
						  notify(`${filepath} ---> to pug`)
						  callback(null, file);

					  } else {
						  //console.log('---not changed--- ' + filepath);
						  callback();
					  }

            /*tree[filepath].forEach((p)=>{
             console.log(p);
             });*/

					  return;
				  }))
				  .pipe(pug({
					  pretty: '\t'
				  }).on('error', function (e) {
					  console.error(e.message);
					  this.end();
				  }))
				  .pipe(flatten({includeParents: 0}))
				  .pipe(gulp.dest(config.dist));
	  });

    // pug
    watch(config.watch.pug, function(file) {
      global.changedTempalteFile = file.path;
      gulp.start(nameOfTask);
    });
    
    // html
    watch(config.watch.html)
      .on('change', _.debounce(function (event) {
	      browserSync.reload();
      }, 500));
  } else {
    // production build
	  gulp.task(nameOfTask, function () {

		  return gulp.src(config.src)
				  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message  error.file %>")}))
				  .pipe(pug({
					  pretty: '\t'
				  }).on('error', function (e) {
					  console.error(e.message);
					  this.end();
				  }))
				  .pipe(flatten({ includeParents: 0 }))
				  .pipe(gulp.dest(config.dist));
	  });
  }
}

module.exports = {
  init:init
};