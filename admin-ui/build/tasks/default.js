var gulp = require('gulp');
var gulpSync = require('gulp-sync')(gulp);

gulp.task('default', ['watch', 'compile', 'webserver']);

gulp.task('build', gulpSync.sync(['clean', ['install', 'compile']]));
