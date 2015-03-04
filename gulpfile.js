var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('test', function() {
  var onError = function(e) {
      gutil.log(e);
      this.emit('end');
  };
  var espower = require('gulp-espower');
  var mocha = require('gulp-mocha');
  return gulp.src(['test/**/*.js', '!test/helper.js'])
  .pipe(espower().on('error', onError))
  .pipe(mocha().on('error', onError));
});

gulp.task('watch', function() {
  return gulp.watch([
    './lib/**/*.js',
    './test/**/*'
  ], ['test']);
});
