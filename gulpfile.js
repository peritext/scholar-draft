var gulp = require('gulp');
var strip = require('gulp-strip-comments');
var babel = require('gulp-babel');
var babelConfig = require('./package.json').babel;


gulp.task('build', function(cb){
  gulp.src([
      'src/*.js',
      'src/**/*.js'
    ])
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('build'));

  gulp.src([
      'src/**/*.json',
      'src/**/**/*.svg',
      'src/**/*.svg'
    ])
    .pipe(strip())
    .pipe(gulp.dest('build'));

  gulp.src([
      'src/**/*.scss'
    ])
    .pipe(gulp.dest('build'));
  cb(null);
});