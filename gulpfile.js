var gulp = require('gulp');
var jade = require('gulp-jade');
var less = require('gulp-less');
var connect = require('gulp-connect');
var deploy = require('gulp-gh-pages');
var path = require('path');

// Jade to html
gulp.task('jade', function() {
  return gulp.src('./src/jade/index.jade')
    .pipe(jade({
      locals: require('./ch_locals.js')
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

// less to css
gulp.task('less', function() {
  return gulp.src('./src/less/index.less')
    .pipe(less({
      paths: [path.join(__dirname, 'src', 'less', 'includes'),
              path.join(__dirname, 'src', 'less', 'components')]
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

gulp.task('static', function() {
  return gulp.src('./static/**/*', {
      base: 'static'
    })
    .pipe(gulp.dest('./dist/static/'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.jade', './resume.json', './ch_locals.js'], ['jade']);
  gulp.watch('./src/**/*.less', ['less']);
  gulp.watch('./resume.json', ['jade']);
});

gulp.task('build', ['jade', 'less', 'static']);

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true,
    fallback: "index.html"
  });
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(deploy());
});

gulp.task('default', ['connect', 'watch']);
