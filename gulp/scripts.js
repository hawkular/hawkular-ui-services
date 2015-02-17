'use strict';

var gulp = require('gulp'),
    tslint = require('gulp-tslint');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

gulp.task('tslint', function () {
  gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe(tslint({
      rulesDirectory: './tslint-rules/'
    }))
    .pipe(tslint.report('verbose'));
});

gulp.task('scripts', function () {
  return gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe($.typescript())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.concat('hawkular-ui-service.js'))
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['tslint', 'scripts']);
