'use strict';

var gulp = require('gulp'),
    tslintRules = require('../tslint.json');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

gulp.task('tslint', function () {
  gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe($.tslint({
      rulesDirectory: './tslint-rules/'
    }))
    .pipe($.tslint.report('verbose'));
});

gulp.task('scripts', function () {

  var license = tslintRules.rules['license-header'][1];

  return gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe($.typescript({
      removeComments: true
    }))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe($.concat('hawkular-ui-service.js'))
    .pipe($.header(license))
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.concat('hawkular-ui-service.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['tslint', 'scripts']);
