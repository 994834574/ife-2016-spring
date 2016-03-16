var gulp = require('gulp');

gulp.task('css', function () {
    var postcss    = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');

    return gulp.src('./public/postcss/**/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([
          require('autoprefixer'),
          require('precss')
        ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./public/css/') );
});

gulp.task('postcss:watch', function() {
  gulp.watch('./public/postcss/**/*.css', ['css']);
});
