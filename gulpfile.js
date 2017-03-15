var
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    watch = require('gulp-watch'),
    sequence = require('run-sequence'),
    cmq = require('gulp-group-css-media-queries'),
    gs = require('gulp-selectors'),
    sourcemaps = require('gulp-sourcemaps'),
    imageminJR = require('imagemin-jpeg-recompress'),
    imageminSvgo = require('imagemin-svgo'),
    favicons = require("gulp-real-favicon"),
    openurl = require('openurl'),
    del = require('del'),
    path = require('path'),
    notify = require('gulp-notify'),
    nib = require('nib'),
    connect = require('connect'),
    serveStatic = require('serve-static');

// Compiling Pug in HTML
gulp.task('views', function() {
    gulp.src('./views/*.pug')
        .pipe($.newer('./public/'))
        .pipe($.pug())
        .pipe(gulp.dest('./public/'))
        .pipe($.livereload())
});

// Compiling Pug in HTML | Develop
gulp.task('views-dev', function() {
    gulp.src('./views/*.pug')
        .pipe($.newer('./public/'))
        .pipe(
            $.pug({
                pretty: true
            })
            .on('error', notify.onError({
                title  : "Pug Error",
                message: "<%= error.message %>",
                sound: "Blow"
            }))
        )
        .pipe(gulp.dest('./public/'))
        .pipe($.livereload())
});

// Compiling Stylus in CSS
gulp.task('css', function() {
    gulp.src('./styl/*.styl')
        .pipe($.newer('./public/css/'))
        .pipe($.stylus({
            use: nib()
        }))
        .pipe(cmq())
        .pipe($.csso())
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(gulp.dest('./public/css/'))
        .pipe($.livereload())
});

// Compiling Stylus in CSS | Develop
gulp.task('css-dev', function() {
    gulp.src('./styl/*.styl')
        .pipe($.newer('./public/css/'))
        .pipe(sourcemaps.init())
        .pipe(
            $.stylus({
                use: nib()
            })
            .on('error', notify.onError({
                title  : "Stylus Error",
                message: "<%= error.message %>",
                sound: "Blow"
            }))
        )
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css/'))
        .pipe($.livereload())
});

// Minify selectors
gulp.task('gs', function() {
    var ignores = {
        classes: ['active', 'webp', 'i-*'],
        ids: '*'
    };
    gulp.src(['./public/**/*.css', './public/**/*.html'])
        .pipe(gs.run({}, ignores))
        .pipe(gulp.dest('./public/'))
});

// Compiling JS
gulp.task('js', function(){
    gulp.src([
        './js/jquery.js',
        './js/main.js'
    ])
        .pipe($.concat('script.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Compiling JS | Develop
gulp.task('js-dev', function(){
    gulp.src([
        './js/jquery.js',
        './js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe($.concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Replace embded JS
gulp.task('js-embded', function(){
    gulp.src('./js/embded/**/*')
        .pipe($.newer('./public/js/'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Replace embded JS | Develop
gulp.task('js-embded-dev', function(){
    gulp.src('./js/embded/**/*')
        .pipe($.newer('./public/js/'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Optimizing images
gulp.task('imagemin', function() {
    gulp.src('./img/**/*')
        .pipe($.newer('./public/img/'))
        .pipe($.imagemin([
            imageminJR({
                method: 'ms-ssim'
            }),
            imageminSvgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./public/img/'))
});

// Generate Webp
gulp.task('webp', function() {
    gulp.src('./img/**/*')
        .pipe($.webp())
        .pipe(gulp.dest('./public/img/'))
});

// Generate favicons
gulp.task('favicons', function () {
    favicons.generateFavicon({
        masterPicture: './img/favicons/favicon.png',
        design: {
            desktopBrowser: {},
            androidChrome: {
                onConflict: 'override',
                pictureAspect: 'noChange',
                manifest: {
                    name: '1000.tech',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                }
            },
            ios: {
                onConflict: 'override',
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#fff',
                margin: '15%'
            },
            safariPinnedTab: {
                onConflict: 'override',
                pictureAspect: 'silhouette'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: 'public/img/favicons/package.json',
        dest: './public/img/favicons/'
    });
});

// Generate icon font
gulp.task('iconfont', function() {
    var
        fontName = 'icon-font',
        cssClass = 'i';
    gulp.src(['./fonts/icon-font/*.svg'])
        .pipe($.imagemin([
            imageminSvgo({
                plugins: [
                    {removeViewBox: true}
                ]
            })
        ]))
        .pipe($.iconfontCss({
            fontName: fontName,
            cssClass: cssClass,
            path: './styl/mixins/icon-font.styl',
            targetPath: '../../styl/components/font/icon-font.styl',
            fontPath: '../fonts/'
        }))
        .pipe($.iconfont({
            fontName: fontName,
            prependUnicode: true,
            normalize: true,
            formats: ['ttf','woff','woff2']
        }))
        .pipe(gulp.dest('./public/fonts/'))
        .pipe($.livereload())
});

// Replace fonts
gulp.task('fonts', function() {
    gulp.src('./fonts/text-font/*')
        .pipe($.newer('./public/fonts/'))
        .pipe(gulp.dest('./public/fonts/'))
});

// Replace seo rule
gulp.task('seo', function() {
    gulp.src('./seo/*')
        .pipe($.newer('./public/'))
        .pipe(gulp.dest('./public/'))
});

// Task for clean public
gulp.task('clean', function() {
    del('./public/')
});

// Web-server
gulp.task('server', function() {
    $.livereload.listen();
    connect()
        .use(require('connect-livereload')())
        .use(serveStatic(__dirname + '/public'))
        .listen('5000');
});

gulp.task('open', function () {
    openurl.open('http://localhost:5000')
});

// Watcher
gulp.task('watch', function() {
    watch('./views/**/*', function() { gulp.start('views') });
    watch('./styl/**/*', function() { gulp.start('css') });
    watch('./js/**/*', function() { gulp.start(['js', 'js-embded']) });
    watch('./img/**/*', function() { gulp.start(['imagemin', 'webp']) });
    watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    watch('./seo/**/*', function() { gulp.start('seo') });
});

// Watcher | Develop
gulp.task('watch-dev', function() {
    watch('./views/**/*', function() { gulp.start('views-dev') });
    watch('./styl/**/*', function() { gulp.start('css-dev') });
    watch('./js/**/*', function() { gulp.start(['js-dev', 'js-embded-dev']) });
    watch('./img/**/*', function() { gulp.start(['imagemin', 'webp']) });
    watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    watch('./seo/**/*', function() { gulp.start('seo') });
});

// Compiling
gulp.task('default', function(cb) {
    return sequence(
        'css','js','js-embded',
        'imagemin','webp','favicons','iconfont','fonts','views',
        'server','watch','open','seo',
        cb);
});

// Compiling | Develop
gulp.task('dev', function(cb) {
    return sequence(
        'css-dev','js-dev','js-embded-dev',
        'imagemin','webp','favicons','iconfont','fonts','views-dev',
        'server','watch-dev','open','seo',
        cb);
});