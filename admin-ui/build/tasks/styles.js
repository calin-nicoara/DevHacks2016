var paths = require('./../paths');
var	gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');

var argv = require('yargs').argv;
var gulpIf = require('gulp-if');

gulp.task('styles',['compile-features'], function () {
	return gulp.src(paths.binCss, {base: paths.root})
		.pipe(concat('style.min.css'))
    .pipe(gulpIf(argv.env && argv.env !== 'local', cleanCss()))
    .pipe(gulp.dest(paths.destCss));
});
