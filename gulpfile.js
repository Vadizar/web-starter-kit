const
    gulp = require('gulp'),
    config = require('./config'),
    $ = require('gulp-load-plugins')({
        pattern: '*'
    });

// Compiling Pug in HTML
gulp.task('views', function() {
    return gulp.src('./views/*.pug')
        .pipe($.newer(CONFIG.path))
        .pipe($.pug())
        .pipe(gulp.dest(CONFIG.path))
        .pipe($.atomizer({
            acssConfig: require('./acssConf.js')
        }))
        .pipe($.csso())
        .pipe(gulp.dest(CONFIG.path + 'css/'))
        .pipe($.livereload())
});

// Compiling Pug in HTML | Develop
gulp.task('views-dev', function() {
    return gulp.src('./views/*.pug')
        .pipe($.newer(CONFIG.path))
        .pipe(
            $.pug({
                // pretty: true
            })
                .on('error', $.notify.onError({
                    title  : "Pug Error",
                    message: "<%= error.message %>",
                    sound: "Blow"
                }))
        )
        .pipe(gulp.dest(CONFIG.path))
        .pipe($.atomizer({
            acssConfig: require('./acssConf.js')
        }))
        .pipe(gulp.dest(CONFIG.path + 'css/'))
        .pipe($.livereload())
});

// Compiling Stylus in CSS
gulp.task('css', function() {
    return gulp.src('./styl/*.styl')
        .pipe($.newer(CONFIG.path + 'css/'))
        .pipe($.stylus({
            use: $.nib()
        }))
        .pipe($.groupCssMediaQueries())
        .pipe($.csso())
        .pipe($.autoprefixer('last 1 versions'))
        .pipe(gulp.dest(CONFIG.path + 'css/'))
});

// Compiling Stylus in CSS | Develop
gulp.task('css-dev', function() {
    return gulp.src('./styl/*.styl')
        .pipe($.newer(CONFIG.path + 'css/'))
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
        .pipe($.autoprefixer({
            overrideBrowserslist: [
                '> 5%',
                'last 1 versions',
                'ie > 9'
            ]
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(CONFIG.path + 'css/'))
});

gulp.task('css-concat', function() {
    return gulp.src([
        CONFIG.path + 'css/app.css',
        CONFIG.path + 'css/atomic.css',
        CONFIG.path + 'css/icons.css'
    ])
        .pipe($.concat('style.css'))
        .pipe(gulp.dest(CONFIG.path + 'css/'))
        .pipe($.livereload())
});

// Minify selectors
gulp.task('gs', function() {
    var ignores = {
        classes: ['active', 'i-*'],
        ids: '*'
    };
    return gulp.src([CONFIG.path + '**/*.css', CONFIG.path + '**/*.html'])
        .pipe($.selectors.run({}, ignores))
        .pipe(gulp.dest(CONFIG.path))
});

// Compiling JS
gulp.task('js', function(){
    return gulp.src([
        './js/detectOS.js',
        './js/main.js',
        './js/menu.js',
        './js/ripple.js'
    ])
        .pipe($.babel())
        .pipe($.concat('script.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(CONFIG.path + 'js/'))
        .pipe($.livereload())
});

// Compiling JS | Develop
gulp.task('js-dev', function(){
    return gulp.src([
        './js/detectOS.js',
        './js/main.js',
        './js/menu.js',
        './js/ripple.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('script.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(CONFIG.path + 'js/'))
        .pipe($.livereload())
});

// Replace App JS
gulp.task('js-app', function(){
    return gulp.src('./js/app/**/*')
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest(CONFIG.path))
        .pipe($.livereload())
});

// Replace inline JS
gulp.task('js-inline', function(){
    return gulp.src('./js/inline/**/*')
        .pipe($.newer(CONFIG.path + 'js/'))
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest(CONFIG.path))
        .pipe($.livereload())
});

// Replace inline JS | Develop
gulp.task('js-inline-dev', function(){
    return gulp.src('./js/inline/**/*')
        .pipe($.newer(CONFIG.path + 'js/'))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(CONFIG.path))
        .pipe($.livereload())
});

// Optimizing images
gulp.task('img', function() {
    return gulp.src('./img/**/*')
        .pipe($.imagemin([
            $.imageminJpegRecompress({
                method: 'smallfry'
            }),
            $.imageminSvgo({
                plugins: [
                    {removeDimensions: true},
                    {removeAttrs: true},
                    {removeElementsByAttr: true},
                    {removeStyleElement: true},
                    {removeViewBox: false}
                ]
            })
        ]))
        .pipe(gulp.dest(CONFIG.path + 'img/'))
        .pipe($.livereload())
});

// Optimizing images | Develop
gulp.task('img-dev', function() {
    return gulp.src('./img/**/*')
        .pipe($.newer(CONFIG.path + 'img/'))
        .pipe($.imagemin())
        .pipe(gulp.dest(CONFIG.path + 'img/'))
        .pipe($.livereload())
});

// Generate favicons
gulp.task('favicons', function(done) {
    $.realFavicon.generateFavicon({
        masterPicture: './img/favicons/favicon.png',
        design: {
            desktopBrowser: {},
            androidChrome: {
                onConflict: 'override',
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#fff',
                margin: '30%',
                manifest: {}
            },
            ios: {
                onConflict: 'override',
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#fff',
                margin: '30%'
            },
            safariPinnedTab: {
                onConflict: 'override',
                pictureAspect: 'silhouette',
                themeColor: '#000'
            },
            windows: {
                onConflict: 'override',
                pictureAspect: 'whiteSilhouette',
                backgroundColor: '#000',
                assets: {
                    windows_80_ie_10_tile: true,
                    windows_10_ie_11_edge_tiles: {
                        small: true,
                        medium: true,
                        big: true,
                        rectangle: true
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
    }, function() {
        done();
    });
});

// Generate icon font
gulp.task('iconfont', function() {
    var
        fontName = 'icon-font',
        cssClass = 'i';
    return gulp.src(['./fonts/icon-font/**/*.svg'])
        .pipe($.iconfontCss({
            fontName: fontName,
            cssClass: cssClass,
            path: './styl/mixins/icon-font.styl',
            // targetPath: '../../styl/components/font/icon-font.styl',
            targetPath: '../css/icons.css',
            fontPath: '../fonts/'
        }))
        .pipe($.iconfont({
            fontName: fontName,
            prependUnicode: true,
            normalize: true,
            formats: ['ttf','woff','woff2']
        }))
        .pipe(gulp.dest(CONFIG.path + 'fonts/'))
        .pipe($.livereload())
});

// Replace fonts
gulp.task('fonts', function() {
    return gulp.src('./fonts/text-font/*')
        .pipe($.newer(CONFIG.path + 'fonts/'))
        .pipe(gulp.dest(CONFIG.path + 'fonts/'))
        .pipe($.livereload())
});

// Replace manifest.json
gulp.task('manifest', function() {
    return gulp.src('./manifest/*')
        .pipe($.newer(CONFIG.path))
        .pipe(gulp.dest(CONFIG.path))
});

// Replace seo rule
gulp.task('seo', function() {
    return gulp.src('./seo/*')
        .pipe($.newer(CONFIG.path))
        .pipe(gulp.dest(CONFIG.path))
});

// Task for clean public
gulp.task('clean', function() {
    return $.del(CONFIG.path)
});

// Web-server
gulp.task('server', function() {
    $.livereload.listen();
    $.nodemon({
        script: 'app'
    });
    $.openurl.open('http://localhost:' + process.host)
});

// Watcher
gulp.task('watch', function() {
    gulp.watch('./views/**/*', gulp.series('views-dev'));
    gulp.watch('./styl/**/*', gulp.series('css-dev','css-concat'));
    gulp.watch('./fonts/**/*', gulp.series('iconfont','fonts','css-dev','css-concat'));
    gulp.watch('./js/**/*', gulp.parallel('js-dev','js-inline-dev'));
    gulp.watch('./img/favicons/**/*', gulp.parallel('favicons'));
    gulp.watch('./img/**/*', gulp.parallel('img-dev'));
    gulp.watch('./manifest/*', gulp.parallel('manifest'));
});

// Compiling
gulp.task('default', gulp.series(
    gulp.series('views','iconfont','fonts','css','css-concat'),
    gulp.parallel('js','js-inline','img','favicons','manifest','server','seo')
));

// Compiling | Develop
gulp.task('dev', gulp.series(
    gulp.series('views-dev','iconfont','fonts','css-dev','css-concat'),
    gulp.parallel('js-dev','js-inline-dev','img-dev','favicons','manifest','server','watch')
));