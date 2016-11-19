"use strict";

var paths = require('./../paths');
var gulp = require('gulp');


gulp.task('copy-icons', function ()  {
  //todo: optimize images
  gulp.src(['app/**/icons/*'])
    .pipe(gulp.dest('www/css/icons'));
});
