require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'jquery',
	    'postal.xframe'
	], function($, postal) {

		postal.instanceId("parent");
		postal.fedx.addFilter([
			{ channel: 'search',         topic: '#', direction: 'both' },
			{ channel: 'ctrl',           topic: '#', direction: 'out'  },
			{ channel: 'language-stats', topic: '#', direction: 'both' },
			{ channel: 'hashtag-stats',  topic: '#', direction: 'both' },
			{ channel: 'user-stats',     topic: '#', direction: 'both' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/

		postal.fedx.signalReady();

		var initd = false;

		$(function(){
			$("#starter" ).on("click", function(){
				if(!initd) {
					initd = true;
					$(".widgets" ).removeClass('hidden');
				}
				postal.publish({
					channel: "ctrl",
					topic  : "search.start",
					data   : {
						searchQry: $("#searchQry" ).val() || "JavaScript"
					}
				})
			});
		});
	});
});