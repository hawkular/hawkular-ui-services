'use strict';

import gulp from 'gulp';
import tslintRules from '../tslint.json';
import merge from 'merge2';

const paths = gulp.paths;

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

const config = {
  main: '.',
  ts: ['src/**/*.ts'],
  tsProject: $.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declaration: true,
    removeComments: true,
    noExternalResolve: false
  })
};


gulp.task('tslint', function () {
  gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe($.tslint({
      rulesDirectory: './tslint-rules/'
    }))
    .pipe($.tslint.report('verbose'));
});

gulp.task('scripts', function () {

  const license = tslintRules.rules['license-header'][1];

  const tsResult = gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest*.ts'])
    .pipe($.typescript(config.tsProject))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    });
  const jsPipe = tsResult
    .pipe($.concat('hawkular-ui-service.js'))
    .pipe($.header(license))
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.concat('hawkular-ui-service.min.js'))
    //.pipe($.uglify())
    .pipe(gulp.dest(paths.dist + '/'));
  return merge([tsResult.dts.pipe(gulp.dest(paths.dist + '/defs')), jsPipe]);
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['tslint', 'scripts']);
