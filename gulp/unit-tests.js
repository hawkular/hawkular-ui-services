'use strict';

const gulp = require('gulp');

const $ = require('gulp-load-plugins')();

const wiredep = require('wiredep');

const minimist = require('minimist');

const paths = gulp.paths;

function runTests (singleRun) {
  const bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  const testFiles = bowerDeps.js.concat([
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
  const bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  const testFiles = bowerDeps.js.concat([
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
      }
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

const knownTestOptions = {
  string: ['hostname', 'port'],
  default: {
     hostname: process.env.HAWKULAR_TEST_HOSTNAME || 'localhost',
     port: process.env.HAWKULAR_TEST_PORT || '8080'
  }
};

const options = minimist(process.argv.slice(2), knownTestOptions);

gulp.task('test', ['scripts'], function (done) { runTests(true /* singleRun */, done) });
gulp.task('test:auto', ['scripts'], function (done) { runTests(false /* singleRun */, done) });

gulp.task('rest:alert', ['scripts'], function (done) { runTestsRest(true, 'alert', options, done) });
gulp.task('rest:metric', ['scripts'], function (done) { runTestsRest(true, 'metric', options, done) });
gulp.task('rest:inventory', ['scripts'], function (done) { runTestsRest(true, 'inventory', options, done) });
