require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'jquery',
	    'postal.xframe',
	    'widgets/stream/tweetCollectionView',
	    'widgets/stream/tweetCollection',
	    'widgets/stream/notificationView'
	], function($, postal, TweetCollectionView, TweetCollection, NotificationView) {

		postal.instanceId("stream");
		postal.fedx.addFilter([
			{ channel: 'search', topic: 'batch.results', direction: 'in' },
			{ channel: 'search', topic: 'started',       direction: 'in' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/

		var main = {
			tweets       : new TweetCollectionView({ collection: new TweetCollection() }),
			notification : new NotificationView()
		};

		postal.fedx.signalReady();

		return main;
	});
});