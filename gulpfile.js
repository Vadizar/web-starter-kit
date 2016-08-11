var
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	sequence = require('run-sequence'),
	pug = require('gulp-pug'),
   stylus = require('gulp-stylus'),
   csso = require('gulp-csso'),
   cmq = require('gulp-combine-mq'),
   gs = require('gulp-selectors'),
   autoprefixer = require('gulp-autoprefixer'),
   concat = require('gulp-concat'),
   uglify = require('gulp-uglify'),
   imagemin = require('gulp-imagemin'),
   imageminJR = require('imagemin-jpeg-recompress'),
   webp = require('gulp-webp'),
   favicons = require("gulp-real-favicon"),
   livereload = require('gulp-livereload'),
   iconfont = require('gulp-iconfont'),
   iconfontCss = require('gulp-iconfont-css'),
   openurl = require('openurl'),
	del = require('del'),
	nib = require('nib'),
	connect = require('connect'),
	serveStatic = require('serve-static');


/*
 * Создаём задачи
 *
 * pug – для HTML-препроцессора Pug
 * stylus – для CSS-препроцессора Stylus
 * concat – для склейки всех CSS и JS в отдельные файлы
 */

gulp.task('views', function() {
	gulp.src('./views/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('./public/'))
		.pipe(livereload())
});

gulp.task('css', function() {
	gulp.src('./styl/*.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(cmq())
		.pipe(csso())
		.pipe(autoprefixer('last 3 versions'))
		.pipe(gulp.dest('./public/css/'))
		.pipe(livereload())
});

gulp.task('gs', function() {
	var ignores = {
		classes: ['active', 'menu', 'nav', 'slide', 'error', 'form-control', 'loader', 'showLoader', 'fadeLoader', 'webp', 'wow', 'owl-*', 'i-*'],
		ids: '*'
	};
	gulp.src(['./public/**/*.css', './public/**/*.html'])
		.pipe(gs.run({}, ignores))
		.pipe(gulp.dest('./public/'))
});

gulp.task('js', function(){
	gulp.src([
			'./js/jquery.js',
			'./js/main.js'
		])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js/'))
		.pipe(livereload())
});

gulp.task('js-embded', function(){
   gulp.src('./js/embded/**/*')
      .pipe(uglify())
      .pipe(gulp.dest('./public/js/'))
      .pipe(livereload())
});

gulp.task('imagemin', function() {
   gulp.src('./img/**/*')
      .pipe(imagemin({
         use: [
            imageminJR({
               method: 'ms-ssim'
            })
         ]
      }))
      .pipe(gulp.dest('./public/img/'))
});

gulp.task('webp', function() {
   gulp.src('./img/**/*')
      .pipe(webp())
      .pipe(gulp.dest('./public/img/'))
});

gulp.task('favicons', function () {
	favicons.generateFavicon({
		masterPicture: './img/favicons/favicon.png',
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

gulp.task('iconfont', function() {
   var
      fontName = 'icon-font',
      cssClass = 'i';
   gulp.src(['./fonts/icon-font/*.svg'])
      .pipe(iconfontCss({
         fontName: fontName,
         cssClass: cssClass,
         path: './styl/mixins/icon-font.styl',
         targetPath: '../../styl/sub/icon-font.styl',
         fontPath: '../fonts/'
      }))
      .pipe(iconfont({
         fontName: fontName,
         prependUnicode: true,
         normalize: true,
         formats: ['svg','ttf','woff','woff2']
      }))
      .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('fonts', function() {
   gulp.src('./fonts/text-font/*')
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
		.listen('5000');
});

gulp.task('open', function () {
	openurl.open('http://localhost:5000')
});

/*
 * Создадим задачу, смотрящую за изменениями
 */
gulp.task('watch', function() {
   watch('./pug/**/*', function() { gulp.start('views') });
   watch('./styl/**/*', function() { gulp.start(['css', 'views']) });
   watch('./js/**/*', function() { gulp.start(['js', 'js-embded']) });
   watch('./img/**/*', function() { gulp.start(['imagemin', 'webp']) });
   watch('./fonts/**/*', function() { gulp.start(['iconfont', 'fonts']) });
   watch('./seo/**/*', function() { gulp.start('seo') });
});

gulp.task('default', function(cb) {
   sequence(
      'server','watch','views','css','js','js-embded',
      'imagemin','webp','iconfont','fonts','seo',
      'open',
      cb);
});