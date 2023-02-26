var gulp = require('gulp')
var browserify = require('browserify')
var log = require('gulplog')
var tap = require('gulp-tap')
var buffer = require('gulp-buffer')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var brfs = require('brfs')
var rename = require('gulp-rename')
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var esbuild = require('esbuild')
gulp.task('browserify', function () {
  return gulp
    .src([
      'public/app/inpage.js',
      'public/app/content-script.js',
    ], { read: false }) // no need of reading file because browserify does.
    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {
      log.info('bundling ' + file.path);
      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {
        debug: false,
        transform: [ brfs ],
      })
      .bundle()
    }))
    .pipe(gulp.dest('dist/app'))
})

gulp.task('background', function () {
  return esbuild.build({
    entryPoints: ["public/app/background.js"],
    bundle: true,
    format: "esm",
    outfile: "dist/app/background.js",
    minify: true,
  })
})


gulp.task('watch', function(){
  gulp.watch(['./public/app/**/*.*'], gulp.series(['build']))
});

gulp.task('build', gulp.series(['browserify','background']))


gulp.task('default', gulp.series('build', 'watch'));
