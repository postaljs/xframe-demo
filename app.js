global._           = require('underscore');
var machina        = require('machina')(global._);
var Monologue      = require('monologue.js')(global._);
var postal         = require("postal")(global._);
var monopost       = require('monopost')(global._, Monologue, postal);
var express        = require('express');
var app            = express();
var server         = require('http').createServer(app);
var Searcher       = require('./lib/twitterSearch')(global._, Monologue);
var io             = require('socket.io').listen(server);
var CountByUser    = require('./lib/countByUser')(global._, Monologue);
var CountByHashtag = require('./lib/countByHashtag')(global._, Monologue);
var PercentByLang  = require('./lib/percentageByLanguage')(global._, Monologue);
var BatchManager   = require('./lib/batchManager')(global._, machina, Monologue, io);


var main = module.exports = {
	init: function() {
		server.listen(8080);
		app.use(express.static(__dirname + '/public'));
		io.set('log level', 1);

		this.searcher.on("search.started", function(data){
			io.sockets.emit( "search.started", data );
		});

		io.sockets.on('connection', function (socket) {
			console.log("client connected");
			postal.publish({
				channel: "search",
				topic: "stop"
			});
			socket.on('search.start', function (data) {
				data = data || {};
				postal.publish({
					channel: "search",
					topic: "start",
					data: data.searchQry || "JavaScript"
				});
			});
		});
	},

	batchManager: new BatchManager(),

	searcher: new Searcher(),

	postal: postal,

	processors: [
		new CountByUser(),
	    new CountByHashtag(),
	    new PercentByLang()
	]
};

main.searcher.on("#", function(d, e) {
	if( e.topic !== "batch.results") {
		console.log( e.topic + " " + (d||""));
	}
});

main.init();