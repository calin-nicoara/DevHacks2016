var gulp = require('gulp');
var gulpSync = require('gulp-sync')(gulp);

gulp.task('serve-files', ['scripts', 'styles', 'html', 'icons']);

gulp.task("compile", gulpSync.sync(['clean-compiled', 'compile-features', 'serve-files']));

