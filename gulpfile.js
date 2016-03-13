var gulp        = require('gulp');
var gutil       = require('gulp-util');
var bowerMain   = require('bower-main');
var del         = require('del');
var concat      = require("gulp-concat");
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");

gulp.task("clean", function() {
   del("client/lib/*"); 
});

gulp.task("app-script", function() {
    return gulp.src("client/app/scripts/*.js")
               .pipe(concat("myapp.min.js"))
               .pipe(uglify())
               .pipe(gulp.dest("client/lib"));
});

gulp.task('bower-js', function() {
    return gulp.src(bowerMain('js','min.js').minifiedNotFound)
               .pipe(uglify())
               .pipe(rename({suffix: ".min"}))
               .pipe(gulp.dest("client/lib"));
});

gulp.task('bower-min-js', function() {
    return gulp.src(bowerMain('js','min.js').minified)
               .pipe(gulp.dest("client/lib"));
});

gulp.task('bower-css', function() {
    return gulp.src(bowerMain('css','min.css').minifiedNotFound)
               .pipe(uglify())
               .pipe(rename({suffix: ".min"}))
               .pipe(gulp.dest("client/lib"));
});

gulp.task('bower-min-css', function() {
    return gulp.src(bowerMain('css','min.css').minified)
               .pipe(gulp.dest("client/lib"));
});

gulp.task('default', ["clean", 'bower-js', 'bower-min-js', 'bower-css', 'bower-min-css']);
