"use strict";

var paths = require('./../paths');

var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');


//jquery needs to be included before anything else. did this from bower.json order
gulp.task('bower-js', function () {
  var filterJS = filter('**/*.js');
  return gulp.src(paths.bower)
    .pipe(mainBowerFiles(
      {
        overrides: {
          bootstrap: {
            main: [
              './dist/js/bootstrap.js'
            ]
          }
        }
      }))
    .pipe(filterJS)
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.destBower));
});

gulp.task('bower-css', function () {
  var filterCss = filter('**/*.css');
  return gulp.src(paths.bower)
    .pipe(mainBowerFiles({
                           overrides: {
                             bootstrap: {
                               main: [
                                 './dist/css/bootstrap.css'
                               ]
                             }
                           }
                         }))
    .pipe(filterCss)
    .pipe(concat('bower.min.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.destBower));
});

gulp.task('fonts-bootstrap', function ()  {
  return gulp.src('bower_components/bootstrap/dist/fonts/**/*.*')
    .pipe(gulp.dest(paths.destFonts));
});

gulp.task('fonts', function() {
  return gulp.src(['bower_components/components-font-awesome/fonts/**/*.*'])
    .pipe(gulp.dest(paths.destFonts));
});

gulp.task('install', ['bower-css', 'bower-js', 'fonts-bootstrap', 'fonts']);
