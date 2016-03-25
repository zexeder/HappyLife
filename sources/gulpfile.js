'use strict';

require('es6-promise').polyfill();

var 
gulp = require('gulp'),
watch = require('gulp-watch'),
prefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
jade = require('gulp-jade'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
rigger = require('gulp-rigger'),
cssmin = require('gulp-minify-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
browserSync = require("browser-sync"),
reload = browserSync.reload;

var path = {
    build: {
        jade: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        jade: 'src/jade/*.jade',
        js: 'src/js/main.js',
        style: 'src/style/main.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        jade: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "qurusan_dev"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('jade:build', function () {
    gulp.src(path.src.jade)
    .pipe(jade())
    .pipe(gulp.dest(path.build.jade))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
    .pipe(rigger()) 
    .pipe(sourcemaps.init()) 
    .pipe(uglify()) 
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: ['src/style/'],
        outputStyle: 'compressed',
        sourceMap: true,
        errLogToConsole: true
    }))
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'jade:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
    ]);


gulp.task('watch', function(){
    watch([path.watch.jade], function(event, cb){
       gulp.start('jade:build');
   });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);