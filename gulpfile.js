var gulp        = require('gulp');
var uglify      = require('gulp-uglify-es').default;
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var cssNano     = require('gulp-cssnano');
var imageMin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
var del         = require('del');
var browserSync = require('browser-sync').create();
var babel       = require('gulp-babel');
gulp.task('browserSync', function() {
  browserSync.init( {
    server: {
        baseDir: 'app'
    }
  })
});

gulp.task('watch', function() {
  gulp.watch('app/**/*', browserSync.reload);
  gulp.watch('app/**/*', ['uglify', 'cssNano', 'imageMin', 'copy'] );
});

gulp.task('copy', function() {
  gulp.src('*.html', {cwd: 'app'})
   .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
  return gulp.src('app/**/*.js')
      .pipe(babel({"presets": ['env']}))
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist/js/'))
      .pipe(rename('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/'));
});

gulp.task('cssNano', function() {
  return gulp.src('app/**/*.css')
    .pipe(cssNano())
    .pipe(gulp.dest('dist'));
});

gulp.task('imageMin', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imageMin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});


gulp.task('default',['clean:dist', 'browserSync','watch']);
