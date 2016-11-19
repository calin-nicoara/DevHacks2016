var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');
var order = require('gulp-order');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

var Log = require('log');
var log = new Log('warning');

var featureTasks = [];
var watchers = [];

glob.sync('app/*').forEach(function (featurePath) {

  var taskName, featureName, binFolder;
  if (fs.statSync(featurePath).isDirectory()) {
    featureName = featurePath.split('/').pop().toLowerCase();
    taskName = 'compile-' + featureName;
    binFolder = featurePath + '/.bin/';

    gulp.task(taskName, function () {
      return gulp.src(featurePath + '/script/**/*.js')
        .pipe(order([
                      '**/*-module.js',
                      '**/*.factory.js',
                      '**/*.service.js',
                      '**/*.directive.js',
                      '**/*.controller.js'
                    ]))
        .pipe(concat(featureName + '.js'))
        .pipe(gulp.dest(binFolder));
    });
    featureTasks.push(taskName);

    gulp.task('watch-' + taskName, function () {
      var watcher = gulp.watch(featurePath + '/script/**/*.js', [taskName]);
      watcher.on('change', function (event) {
        log.info('File ' + event.path + ' was ' + event.type + ', running task ' + taskName);
      });
    });
    watchers.push('watch-' + taskName);

    gulp.task('sass-' + featureName, function () {
      return gulp.src([featurePath + '/sass/**/*.sass', '!' + featurePath + '/sass/**/_*.sass'])
        .pipe(sass(
          {
            indentedSyntax: true,
            errLogToConsole: true,
            sourceComments: 'normal'
          }
        ))
        .pipe(concat(featureName + '.css'))
        .pipe(gulp.dest(binFolder));
    });
    featureTasks.push('sass-' + featureName);

    gulp.task('watch-sass-' + featureName, function () {
      var taskName = 'sass-' + featureName;
      var watcher = gulp.watch(featurePath + '/sass/**/*.sass', ['sass-' + featureName]);
      watcher.on('change', function (event) {
        log.info('File ' + event.path + ' was ' + event.type + ', running task ' + taskName);
      });
    });

    watchers.push('watch-sass-' + featureName);

    gulp.task('watch-html-' + featureName, function () {
      gulp.watch(featurePath + 'www/**/*', ['html']).on('change', function (event) {
        log.info('File ' + event.path + ' was ' + event.type + ', running task html');
      });
    });
    watchers.push('watch-html-' + featureName);
  }

});


gulp.task('compile-features', featureTasks);
gulp.task('watch-features', watchers);
