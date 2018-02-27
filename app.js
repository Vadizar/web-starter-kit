/**
 * Module dependencies
 */
var
    express = require('express'),
    app = express(),
    helmet = require('helmet'),
    shrinkRay = require('shrink-ray-current'),
    config = require('./config');

/**
 * Compression
 */
app.use(shrinkRay());

/**
 * Secure Express
 */
app.use(helmet());

/**
 * View dir
 */
app.use(express.static(__dirname + '/public'));

/**
 * View engine setup
 */
app.set('view engine', 'pug');

/**
 * Handle 404
 */
app.get('*', function(req, res){
    res.status(404);
    res.render('404');
});

/**
 * Livereload if develop
 */
// if (process.develop) {
app.use(require('connect-livereload')({ port: 35729 }));
// }

/**
 * Create HTTPS server and Listen on provided port
 */
if (process.production) {
    var http2 = require('spdy'),
        options = {
            // The path to SSL certificate
            // cert: fs.readFileSync('../fullchain.pem'),
            // key: fs.readFileSync('../privkey.pem')
        };
    http2.createServer(options, app).listen(443);

    // Redirect HTTP to HTTPS if production
    app.use(function(req, res, next) {
        if (req.secure && req.headers.host.match(/^www/) === null) {
            next();
        } else {
            res.redirect(301, 'https://' + req.headers.host + req.url);
        }
        // if (req.headers.host.match(/^www/) !== null ) {
        //     res.redirect(301, 'https://' + req.headers.host.replace(/^www\./, '') + req.url);
        // } else {
        //     next();
        // }
    });
}

/**
 * Create HTTP server and Listen on provided port
 */
var http = require('http');
http.createServer(app).listen(process.host, function (err) {
    if (err) throw err;
    console.log('Server start on ' + process.host + ' port.');
});