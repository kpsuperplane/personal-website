var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var merge = require('merge-stream');
gulp.task('less', function () {
    return gulp.src('css/*.less')
        .pipe(watch('css/*.less'))
        .pipe(less())
        .pipe(uglifycss())
        .pipe(gulp.dest('css'));
});
gulp.task('js', function () {
    return gulp.src('js/main.js')
        .pipe(watch('js/main.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('js'));
});