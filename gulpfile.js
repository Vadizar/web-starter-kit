var
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	sequence = require('gulp-sequence'),
	stylus = require('gulp-stylus'),
	uncss = require('gulp-uncss'),
	csso = require('gulp-csso'),
	cssnano = require('gulp-cssnano'),
	cmq = require('gulp-combine-mq'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	imageminJR = require('imagemin-jpeg-recompress'),
	jpegtran = require('imagemin-jpegtran'),
	svgmin = require('gulp-svgmin'),
	favicons = require("gulp-real-favicon"),
	livereload = require('gulp-livereload'),
	openurl = require('openurl'),
	del = require('del'),
	nib = require('nib'),
	connect = require('connect'),
	serveStatic = require('serve-static');


/*
 * Создаём задачи
 *
 * jade – для HTML-препроцессора Jade
 * stylus – для CSS-препроцессора Stylus
 * coffee – для JavaScript-препроцессора CoffeеScript
 * concat – для склейки всех CSS и JS в отдельные файлы
 */

gulp.task('stylus', function() {
	gulp.src('./styl/style.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(uncss({
			html: ['http://localhost:3000']
		}))
		.pipe(cmq())
		.pipe(csso())
		.pipe(cssnano())
		.pipe(autoprefixer('last 3 versions'))
		//.pipe(gs.run())
		.pipe(gulp.dest('./public/css/'))
		.pipe(livereload())
});

gulp.task('404', function() {
	gulp.src('./styl/404.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(cmq())
		.pipe(csso())
		.pipe(cssnano())
		.pipe(autoprefixer('last 3 versions'))
		.pipe(gulp.dest('./public/css/'))
		.pipe(livereload())
});

gulp.task('js', function(){
	gulp.src([
			'./js/jquery.js',
			'./js/wow.js',
			'./js/menu.js',
			'./js/scrollspy.js',
			'./js/main.js',
			'./js/temp/contact.bundled.js',
			'./js/owl.carousel.js',
			'./js/metrika.js',
			'./js/metrika-initial.js'
		])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js/'))
		.pipe(livereload())
});

gulp.task('ie', function(){
	gulp.src('./js/ie.js')
		.pipe(uglify())
		.pipe(gulp.dest('./public/js/'))
		.pipe(livereload())
});

gulp.task('imagemin', function() {
	gulp.src(['./img/*', './img/*/*'])
		.pipe(imagemin({
			progressive: true,
			use: [
				imageminJR({method: 'ms-ssim'}),
				jpegtran()
			]
		}))
		.pipe(gulp.dest('./public/img/'))
});

gulp.task('svgmin', function () {
	gulp.src('./svg/*')
		.pipe(svgmin())
		.pipe(gulp.dest('./public/svg/'))
});

gulp.task('favicons', function () {
	favicons.generateFavicon({
		masterPicture: './img/favicons/1000tech.png',
		dest: './public/img/favicons/',
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
				backgroundColor: '#f0f3f7',
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
		}
	});
});

gulp.task('fonts', function() {
	gulp.src('./fonts/*')
		.pipe(gulp.dest('./public/fonts/'))
});

gulp.task('seo', function() {
	gulp.src('./seo/*')
		.pipe(gulp.dest('./public/'))
});

gulp.task('clean', function() {
	del('./public/')
});

/*
 * Создадим веб-сервер, чтобы работать с проектом через браузер
 */
gulp.task('server', function() {
	connect()
		.use(require('connect-livereload')())
		.use(serveStatic(__dirname + '/public'))
		.listen('4000');
});

gulp.task('open', function () {
	openurl.open('http://localhost:4000')
});

/*
 * Создадим задачу, смотрящую за изменениями
 */
gulp.task('watch', function() {
	watch('./styl/**/*.styl', function() { gulp.start('stylus') });
	watch('./styl/404.styl', function() { gulp.start('404') });
	watch('./js/**/*.js', function() { gulp.start('js') });
	watch('./js/ie.js', function() { gulp.start('ie') });
	watch('./img/**/*', function() { gulp.start('imagemin') });
	watch('./svg/*', function() { gulp.start('svgmin') });
	watch('./seo/**/*.*', function() { gulp.start('seo') });
});

gulp.task('default', sequence(
	'server',
	'stylus',
	['404','js','ie','imagemin','svgmin','fonts','seo'],
	'watch','open'
));