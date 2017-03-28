var
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: '*'
    });

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
            .on('error', $.notify.onError({
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
            use: $.nib()
        }))
        .pipe($.groupCssMediaQueries())
        .pipe($.csso())
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(gulp.dest('./public/css/'))
        .pipe($.livereload())
});

// Compiling Stylus in CSS | Develop
gulp.task('css-dev', function() {
    gulp.src('./styl/*.styl')
        .pipe($.newer('./public/css/'))
        .pipe($.sourcemaps.init())
        .pipe(
            $.stylus({
                use: $.nib()
            })
            .on('error', $.notify.onError({
                title  : "Stylus Error",
                message: "<%= error.message %>",
                sound: "Blow"
            }))
        )
        .pipe($.autoprefixer('last 3 versions'))
        .pipe($.sourcemaps.write())
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
        .pipe($.selectors.run({}, ignores))
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
        .pipe($.sourcemaps.init())
        .pipe($.concat('script.js'))
        .pipe($.sourcemaps.write())
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
        .pipe($.sourcemaps.init())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Optimizing images
gulp.task('imagemin', function() {
    gulp.src('./img/**/*')
        .pipe($.newer('./public/img/'))
        .pipe($.imagemin([
            $.imageminJpegRecompress({
                method: 'ms-ssim'
            }),
            $.imageminSvgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./public/img/'))
        .pipe($.livereload())
});

// Optimizing images | Develop
gulp.task('imagemin-dev', function() {
    gulp.src('./img/**/*')
        .pipe($.newer('./public/img/'))
        .pipe($.imagemin([
            $.imageminJpegRecompress({
                method: 'smallfry'
            }),
            $.imageminSvgo({
                plugins: [
                    {removeViewBox: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./public/img/'))
        .pipe($.livereload())
});

// Generate Webp
gulp.task('webp', function() {
    gulp.src('./img/**/*')
        .pipe($.webp())
        .pipe(gulp.dest('./public/img/'))
});

// Generate favicons
gulp.task('favicons', function () {
    $.realFavicon.generateFavicon({
        masterPicture: './img/favicons/favicon.png',
        design: {
            desktopBrowser: {},
            androidChrome: {
                onConflict: 'override',
                pictureAspect: 'noChange',
                manifest: {
                    name: '1000.tech',
                    short_name: '1000.tech',
                    display: 'standalone',
                    background_color: '#fff',
                    theme_color: '#fff',
                    onConflict: 'override',
                    declared: true
                }
            },
            ios: {
                onConflict: 'override',
                pictureAspect: 'backgroundAndMargin'
            },
            safariPinnedTab: {
                onConflict: 'override',
                pictureAspect: 'silhouette'
            },
            windows: {
                picture_aspect: 'white_silhouette',
                background_color: '#333',
                assets: {
                    windows_80_ie_10_tile: true,
                    windows_10_ie_11_edge_tiles: {
                        small: false,
                        medium: true,
                        big: true,
                        rectangle: false
                    }
                }
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
    gulp.src(['./fonts/icon-font/**/*.svg'])
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
        .pipe($.livereload())
});

// Replace seo rule
gulp.task('seo', function() {
    gulp.src('./seo/*')
        .pipe($.newer('./public/'))
        .pipe(gulp.dest('./public/'))
});

// Task for clean public
gulp.task('clean', function() {
    $.del('./public/')
});

// Web-server
gulp.task('server', function() {
    $.livereload.listen();
    $.connect()
        .use(require('connect-livereload')())
        .use($.serveStatic(__dirname + '/public'))
        .listen('5000');
});

gulp.task('open', function () {
    $.openurl.open('http://localhost:5000')
});

// Watcher
gulp.task('watch', function() {
    $.watch('./views/**/*', function() { gulp.start('views') });
    $.watch('./styl/**/*', function() { gulp.start('css') });
    $.watch('./js/**/*', function() { gulp.start(['js', 'js-embded']) });
    $.watch('./img/**/*', function() { gulp.start(['imagemin', 'webp']) });
    $.watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    $.watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    $.watch('./seo/**/*', function() { gulp.start('seo') });
});

// Watcher | Develop
gulp.task('watch-dev', function() {
    $.watch('./views/**/*', function() { gulp.start('views-dev') });
    $.watch('./styl/**/*', function() { gulp.start('css-dev') });
    $.watch('./js/**/*', function() { gulp.start(['js-dev', 'js-embded-dev']) });
    $.watch('./img/**/*', function() { gulp.start(['imagemin-dev', 'webp']) });
    $.watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    $.watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    $.watch('./seo/**/*', function() { gulp.start('seo') });
});

// Compiling
gulp.task('default', function(cb) {
    return $.sequence(
        'css','js','js-embded',
        'imagemin','webp','favicons','iconfont','fonts','views',
        'server','watch','open','seo',
        cb);
});

// Compiling | Develop
gulp.task('dev', function(cb) {
    return $.sequence(
        'css-dev','js-dev','js-embded-dev',
        'imagemin-dev','webp','favicons','iconfont','fonts','views-dev',
        'server','watch-dev','open','seo',
        cb);
});