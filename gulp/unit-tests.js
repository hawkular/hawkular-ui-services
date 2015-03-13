'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

var minimist = require('minimist');

var paths = gulp.paths;

function runTests (singleRun) {
  var bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    paths.src + '/*.spec.js',
    paths.dist + '/*.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

function runTestsRest (singleRun, service, options) {
  var bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    paths.src + '/hawkRest.spec.rest.js',
    paths.src + '/hawkRest-' + service + '*.spec.rest.js',
    paths.dist + '/*.js'
  ]);

  gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: (singleRun)? 'run': 'watch',
      client: {
        hostname: options.hostname,
        port: options.port
      },
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

var knownTestOptions = {
  string: ['hostname', 'port'],
  default: {
     hostname: process.env.HAWKULAR_TEST_HOSTNAME || 'localhost',
     port: process.env.HAWKULAR_TEST_PORT || '8080'
  }
};

var options = minimist(process.argv.slice(2), knownTestOptions);

gulp.task('test', ['scripts'], function (done) { runTests(true /* singleRun */, done) });
gulp.task('test:auto', ['scripts'], function (done) { runTests(false /* singleRun */, done) });

gulp.task('rest:alert', ['scripts'], function (done) { runTestsRest(true, 'alert', options, done) });
gulp.task('rest:metric', ['scripts'], function (done) { runTestsRest(true, 'metric', options, done) });
gulp.task('rest:inventory', ['scripts'], function (done) { runTestsRest(true, 'inventory', options, done) });
