"use strict";

var gulp = require('gulp');
var clean = require('gulp-clean');
var paths = require('./../paths');

gulp.task("clean-compiled", function ()  {
  return gulp.src([paths.dest + '*', '!' + paths.destBower, '!' + paths.destFonts])
    .pipe(clean());
});

gulp.task("clean", function ()  {
  return gulp.src(paths.dest, {read: false})
    .pipe(clean());
});
