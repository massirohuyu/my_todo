// rails-apiとriotを使用する時用gulpfile

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    pleeease = require('gulp-pleeease'),
    plumber = require('gulp-plumber'),
    riot = require('gulp-riot'),
    sass = require('gulp-sass'),
    slim = require('gulp-slim'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    bourbon = require('node-bourbon');

var htmlFiles = [
        "app/views/**/*.html"
    ],

  slimFiles = [
        "app/views/**/*.slim"
    ],

  fontFiles = [
        "app/assets/fonts/**/*"
    ],
  fontLibFiles = [
        "node_modules/font-awesome/fonts/*"
    ],

  imageFiles = [
        "app/assets/images/*"
    ],

  scssTopFile = "app/assets/stylesheets/*.scss",
  scssFiles = [
        "app/assets/stylesheets/**/*.scss"
    ],

  cssFiles = [
        "app/assets/stylesheets/**/*.css"
    ],

  jsFiles = [
        "app/assets/javascripts/tags/*.js",
        "app/assets/javascripts/**/*.js"
    ],
  jsLibFiles = [
      "node_modules/riot/riot.min.js",
      "node_modules/reqwest/reqwest.min.js",
      "node_modules/lodash/lodash.min.js"
    ],
  riotTagFiles = [
        "app/assets/tags/**/*.tag.slim"
    ];

var sassIncludePaths = [
        "./node_modules/bootstrap-sass/assets/stylesheets",
        "./node_modules/font-awesome/scss"
    ].concat(bourbon.includePaths);


//================================================================
// htmls
//================================================================

// slim
//---------------------------------------

gulp.task('slim', function () {
  gulp.src(slimFiles)
    .pipe(plumber())
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest('public/'));
});

// html copy
//---------------------------------------

gulp.task('html-copy', function () {
  gulp.src(htmlFiles)
    .pipe(gulp.dest('public/'));
});


//================================================================
// stylesheets
//================================================================

// scss to css with bourbon
//---------------------------------------

gulp.task('sass', function () {
  gulp.src(scssTopFile)
    .pipe(plumber())
    .pipe(sass({
        includePaths: sassIncludePaths,
        outputStyle: 'expanded'
      })
      .on('error', sass.logError))
    .pipe(pleeease({
      minifier: false,
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    }))
    .pipe(concat('application.css'))
    .pipe(gulp.dest('public/assets/stylesheets/'));
});

// css minify
//---------------------------------------

gulp.task('css-minify', function () {
  gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(concat('application.css'))
    .pipe(minifyCSS({
      'keepBreaks': false
    }))
    .pipe(gulp.dest('public/assets/stylesheets/'));
});


//================================================================
// javascripts
//================================================================

// tag to js
//---------------------------------------

gulp.task('riot', function () {
  gulp.src(riotTagFiles)
    .pipe(plumber())
    .pipe(slim({
      pretty: true
    }))
    .pipe(riot())
    .pipe(gulp.dest('app/assets/javascripts/tags/'));
});

// js minify
//---------------------------------------

gulp.task('js-minify', function () {
  gulp.src(jsLibFiles.concat(jsFiles))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('application.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascripts/'));
});


//================================================================
// other asstes
//================================================================

// font copy
//---------------------------------------

gulp.task('font-copy', function () {
  gulp.src(fontFiles)
    .pipe(gulp.dest('public/assets/fonts/'));
  gulp.src(fontLibFiles)
    .pipe(gulp.dest('public/assets/fonts/'));
});

// images copy
//---------------------------------------

gulp.task('images-copy', function () {
  gulp.src(imageFiles)
    .pipe(gulp.dest('public/assets/images/'));
});


//================================================================
// init and watch
//================================================================

// watch
//---------------------------------------

gulp.task('watch', [
  'slim',
  'html-copy',
  'sass',
//  'css-minify',
  'riot',
  'js-minify'
], function () {
  gulp.watch(slimFiles, ['slim']);
  gulp.watch(htmlFiles, ['html-copy']);
  gulp.watch(scssFiles, ['sass']);
//  gulp.watch(cssFiles, ['css-minify']);
  gulp.watch(riotTagFiles, ['riot']);
  gulp.watch(jsFiles, ['js-minify']);
});

// init
//---------------------------------------

gulp.task('init', [
  'slim',
  'html-copy',
  'sass',
//  'css-minify',
  'riot',
  'js-minify',
  'font-copy',
  'images-copy',
]);


// default
//---------------------------------------

gulp.task('default', ['watch']);