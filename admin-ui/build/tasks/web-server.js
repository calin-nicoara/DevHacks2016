var  gulp = require('gulp');
var  webserver = require('gulp-webserver');

gulp.task('webserver', function(){
  return gulp.src('www')
    .pipe(webserver({
                      port: 9000,
                      host: "0.0.0.0",
                      livereload: true,
                      open: 'http://localhost:9000',
                      proxies: [
                        { source: '/api', target: 'http://localhost:8080/api'},
                        { source: '/auth', target: 'http://localhost:8080/auth'},
                        { source: '/media/images', target: 'http://dev-media-server.ecarrefour.ro/api/images'},
                        { source: '/media/bulk', target: 'http://dev-media-server.ecarrefour.ro/api/bulk'}
                      ],
                      fallback: 'index.html'
                    }));
});
