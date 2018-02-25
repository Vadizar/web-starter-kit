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
                // pretty: true
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
        .pipe($.autoprefixer('last 2 versions'))
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
        .pipe($.autoprefixer({
            browsers: [
                '> 5%',
                'last 2 versions',
                'ie > 9'
            ]
        }))
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
        './js/main.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('script.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Replace App JS
gulp.task('js-app', function(){
    gulp.src('./js/app/**/*')
        .pipe($.uglify())
        .pipe(gulp.dest('./public/'))
        .pipe($.livereload())
});

// Replace inline JS
gulp.task('js-inline', function(){
    gulp.src('./js/inline/**/*')
        .pipe($.newer('./public/js/'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public/js/'))
        .pipe($.livereload())
});

// Replace inline JS | Develop
gulp.task('js-inline-dev', function(){
    gulp.src('./js/inline/**/*')
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
        .pipe(gulp.dest('./public/img/'))
        .pipe($.livereload())
});

// Optimizing images | Develop
// Optimizing images | Develop
gulp.task('imagemin-dev', function() {
    gulp.src('./img/**/*')
        .pipe($.newer('./public/img/'))
        .pipe($.imagemin())
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
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#fff',
                margin: '15%',
                manifest: {}
            },
            ios: {
                onConflict: 'override',
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#fff',
                margin: '15%'
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

// Replace manifest.json
gulp.task('manifest', function() {
    gulp.src('./manifest/*')
        .pipe(gulp.dest('./public/'))
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
    var port = process.argv[4] || 5000;
    $.livereload.listen();
    $.express()

        // Livereload
        .use($.connectLivereload({ port: 35729 }))

        // View dir
        .use($.express.static(__dirname + '/public'))

        // View engine setup
        .set('view engine', 'pug')

        // Handle 404
        .get('*', function(req, res){
            res.status(404);
            res.render('404');
        })

        // Port
        .listen(port, function (err) {
            if (err) throw err;
            console.log('Server start on ' + port + ' port.');
            $.openurl.open('http://localhost:' + port);
        });
});

// Watcher
gulp.task('watch', function() {
    $.watch('./views/**/*', function() { gulp.start('views') });
    $.watch('./styl/**/*', function() { gulp.start('css') });
    $.watch('./js/**/*', function() { gulp.start(['js', 'js-inline']) });
    $.watch('./img/**/*', function() { gulp.start(['imagemin', 'webp']) });
    $.watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    $.watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    $.watch('./seo/**/*', function() { gulp.start('seo') });
});

// Watcher | Develop
gulp.task('watch-dev', function() {
    $.watch('./views/**/*', function() { gulp.start('views-dev') });
    $.watch('./styl/**/*', function() { gulp.start('css-dev') });
    $.watch('./js/**/*', function() { gulp.start(['js-dev', 'js-inline-dev']) });
    $.watch('./img/**/*', function() { gulp.start(['imagemin-dev', 'webp']) });
    $.watch('./img/favicons/**/*', function() { gulp.start('favicons') });
    $.watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
    $.watch('./seo/**/*', function() { gulp.start('seo') });
});

// Compiling
gulp.task('default', function(cb) {
    return $.sequence(
        ['css','js','js-inline',
        'imagemin','webp','favicons','iconfont','fonts'],'views',
        ['server','watch','manifest','seo'],
        cb);
});

// Compiling | Develop
gulp.task('dev', function(cb) {
    return $.sequence(
        ['css-dev','js-dev','js-inline-dev',
        'imagemin-dev','webp','favicons','iconfont','fonts'],'views-dev',
        ['server','watch-dev'],
        cb);
});