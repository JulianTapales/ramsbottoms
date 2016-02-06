/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    del = require('del'),
    browserify = require('gulp-browserify');

var baseDir = "assets/src/"
var outDir = "assets/dest/"

// Styles
gulp.task('styles', function() {
  return sass(baseDir+'css/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(outDir+'css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano({zindex: false}))
    .pipe(gulp.dest(outDir+'css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(baseDir+'js/main.js')
    .pipe(browserify({
		  insertGlobals : false,
		  debug : false
		}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(outDir+'js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(outDir+'js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(baseDir+'img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(outDir+'img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del([outDir+'css', outDir+'js', outDir+'img/scaled']);
});

//Build for s3
gulp.task('build-s3', function(){
  gulp.src([baseDir+'**/*'])
    .pipe(gulp.dest('build-s3'));
  //return
})

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(baseDir+'css/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(baseDir+'js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch(baseDir+'img/scaled/**/*', ['images']);
});
