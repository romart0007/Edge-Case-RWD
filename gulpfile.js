var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var errorHandler = require('gulp-error-handle');



//catch potential error
var logError = function(err) {
  gutil.log(err);
  this.emit('end');
};

gulp.task('css', function() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'))
});

gulp.task('copy', function() {
   return gulp.src('./src/*.html') //./*.html
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
});


gulp.task('buildJs', function() {
  return gulp.src('./src/js/*.js')
    .pipe(errorHandler(logError))
    .pipe(uglify())
    .pipe(concat('main.js')) 
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
});

gulp.task('browserSync', function() {
   browserSync.init({
     server:{
        baseDir: 'dist'
     }
   })
});

gulp.task('watch', ['browserSync','css', 'buildJs'], function() {
  gulp.watch('./src/sass/**/*.scss', ['css']); 
  gulp.watch('./src/js/*.js', ['buildJs']); 
  gulp.watch('./src/*.html', ['copy']);  
});