const port = 1337;

// required modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// array of MIME-types
var mimeTypes = {
	"html"	:	"text/html",
	"css"	:	"text/css",
	"js"	:	"text/javascript",
	"jpeg"	:	"image/jpeg",
	"jpg"	:	"image/jpeg",	
	"png"	:	"image/png"	
};

// server creation
http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading ' + uri);
	var stats;

	try	{
		stats = fs.lstatSync(fileName);
	} catch (e) {
		res.writeHead(404, {'Content-type' : 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return;
	}

	// check if it's a file or a dir
	if (stats.isFile()) {
		var mimeType = mimeTypes[
			path.extname(fileName).split(".").reverse()[0]
		];
		res.writeHead(200, {'Content-type' : mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if (stats.isDirectory()) {
		res.writeHead(302, {
			'Location'	:	'index.html'
		});
		res.end();
	} else {
		res.writeHead(500, {'Content-type' : 'text/plain'});
		res.write('500 Internal server error\n');
		res.end();
	}
}).listen(port);
