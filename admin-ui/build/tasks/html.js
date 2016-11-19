var paths = require('./../paths');
var	path = require('path');
var	gulp = require('gulp');
var	rename = require('gulp-rename');

function htmlTask(){
	return gulp.src(paths.html, {base: 'app/'})
		.pipe(rename(function (p) {
			var feature = p.dirname.split(/\\|\//)[0];
      var newDir = p.dirname.replace(path.join(feature, "www"), "");
			p.dirname = newDir;
		}))
		.pipe(gulp.dest(paths.dest))
}
gulp.task('html', htmlTask);
