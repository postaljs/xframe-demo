require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'socketio',
	    'postal.xframe'
	], function(io, postal) {

		postal.instanceId("comm");
		postal.fedx.addFilter([
			{ channel: 'ctrl',           topic: '#',             direction: 'in'  },
			{ channel: 'language-stats', topic: '#',             direction: 'out' },
			{ channel: 'hashtag-stats',  topic: '#',             direction: 'out' },
			{ channel: 'user-stats',     topic: '#',             direction: 'out' },
			{ channel: 'search',         topic: 'batch.results', direction: 'out' },
			{ channel: 'search',         topic: 'started',       direction: 'out' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/

		var socket = io.connect(window.location.origin);
		socket.on('postal.batch', function (batch) {
			_.each(batch, postal.publish);
		});
		socket.on('search.started', function (data) {
			postal.publish({
				channel : "search",
				topic   : "started",
				data    : data
			});
		});

		postal.subscribe({
			channel : "ctrl",
			topic   : "search.start",
			callback: function(d, e) {
				socket.emit("search.start", d);
			}
		});

		postal.fedx.signalReady();

		return {
			postal     : postal,
			socket     : socket
		}
	});
});