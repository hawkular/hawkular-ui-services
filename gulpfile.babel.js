/*
 * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import concat from 'gulp-concat';
import del from 'del';
import header from 'gulp-header';
import gulp from 'gulp';
import karma from 'gulp-karma';
import merge from 'merge2';
import minimist from 'minimist';
import tslint from 'gulp-tslint';
import typescript from 'gulp-typescript';
import wiredep from 'wiredep';
import uglify from 'gulp-uglify';

import tslintRules from './tslint.json';

const config = {
  main: '.',
  ts: ['src/**/*.ts'],
  test: {
    testDir: 'src/test/'
  },
  licenseBuildHeader:
"/*\n * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates\n * and other contributors as indicated by the" +
" @author tags.\n * \n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n",
  tsProject: typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declaration: true,
    removeComments: true,
    noExternalResolve: false
  })
};

gulp.paths = {
  src: 'src/rest',
  dist: 'dist',
  tmp: '.tmp',
  e2e: config.test.testDir + 'rest'

};

gulp.task('default', ['clean', 'build']);

const paths = gulp.paths;


// @todo: add licenseHeaderChecker back in later once compatible with new version of tslint
gulp.task('tslint', () => {
  gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest-*.ts'])
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('scripts', () => {

  const license = config.licenseBuildHeader;

  const tsResult = gulp.src([paths.src + '/hawkRest.ts', paths.src + '/hawkRest*.ts'])
    .pipe(typescript(config.tsProject))
    .on('error', (err) => {
      console.error(err.toString());
      this.emit('end');
    });
  const jsPipe = tsResult
    .pipe(concat('hawkular-ui-service.js'))
    .pipe(header(license))
    .pipe(gulp.dest(paths.dist + '/'))
  .pipe(concat('hawkular-ui-service.min.js'))
  //.pipe(uglify())
  .pipe(gulp.dest(paths.dist + '/'));
  return merge([tsResult.dts.pipe(gulp.dest(paths.dist + '/defs')), jsPipe]);
});


gulp.task('clean', (done) => {
  del([paths.dist + '/', paths.tmp + '/'], done);
});


function runTests(singleRun) {
  const bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  const testFiles = bowerDeps.js.concat([
    paths.e2e + '/*.spec.js',
    paths.dist + '/*.js'
  ]);

  gulp.src(testFiles)
    .pipe(karma({
      configFile: config.test.testDir + 'karma.conf.js',
      action: (singleRun) ? 'run' : 'watch'
    }))
    .on('error', (err) => {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      throw err;
    });
}

function runTestsRest(singleRun, service, options) {
  const bowerDeps = wiredep({
    directory: 'lib',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  const testFiles = bowerDeps.js.concat([
    paths.e2e + '/hawkRest.spec.rest.js',
    paths.e2e + '/hawkRest-' + service + '*.spec.rest.js',
    paths.dist + '/*.js'
  ]);
  gulp.src(testFiles)
    .pipe(karma({
      configFile: config.test.testDir + 'karma.conf.js',
      action: (singleRun) ? 'run' : 'watch',
      client: {
        hostname: options.hostname,
        port: options.port
      }
    }))
    .on('error', (err) => {
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

gulp.task('test', ['scripts'], (done) => {
  runTestsRest(true, '', options, done)
});

gulp.task('test:auto', ['scripts'], (done) => {
  runTests(false /* singleRun */, done)
});

gulp.task('rest:alert', ['scripts'], (done) => {
  runTestsRest(true, 'alert', options, done)
});

gulp.task('rest:metric', ['scripts'], (done) => {
  runTestsRest(true, 'metric', options, done)
});

gulp.task('rest:inventory', ['scripts'], (done) => {
  runTestsRest(true, 'inventory', options, done)
});

gulp.task('rest:test', ['scripts'], (done) => {
  runTestsRest(true, 'test', options, done)
});

gulp.task('build', ['tslint', 'scripts']);
