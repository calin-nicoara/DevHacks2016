var paths = require('./../paths');
var	gulp = require('gulp');
var	concat = require('gulp-concat');
var	uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var argv = require('yargs').argv;
var gulpIf = require('gulp-if');

var environment =  argv.env || 'local';

gulp.task('scripts', function () {
	return gulp.src([paths.binJs])
		.pipe(concat('app.min.js'))
    .pipe(gulpIf(environment !== 'local', ngAnnotate()))
		.pipe(gulpIf(environment !== 'local', uglify()))
		.pipe(gulp.dest(paths.destJs));
});
