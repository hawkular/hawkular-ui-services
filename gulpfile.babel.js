'use strict';

import gulp from 'gulp';

gulp.paths = {
  src: 'src/rest',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

const $ = require('gulp-load-plugins')();

gulp.task('default', ['clean','build']);
