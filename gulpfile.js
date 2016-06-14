
var typescript = require('gulp-typescript');
var gulp = require('gulp');
var tsd = require('gulp-tsd');
var watch = require('gulp-watch');

/**
 * TypeScript関連
 */
gulp.task('tsc', function(callback){
    return gulp.src( "src/ts/**/*.ts")
      .pipe(typescript({ target: "ES5", removeComments: false, module: "commonjs" }))
      .js
      .pipe(gulp.dest("dist"));
});
gulp.task("tsd", function (callback) {
    return tsd({
        command: "reinstall",
        config:  "tsd.json"
    }, callback);
});

gulp.task('watch', function(){
  gulp.watch('src/**/*.ts', ['tsc']);
});
