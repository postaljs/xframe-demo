require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'jquery',
		'underscore',
	    'postal.xframe',
	    'widgets/hashtagStats/tagCloudPresenter',
	    'widgets/hashtagStats/tagCloudViewModel',
	    'tagcanvas'
	], function($, _, postal, TagCloudPresenter, TagCloudViewModel) {

		postal.instanceId("hashtag-stats");
		postal.fedx.addFilter([
			{ channel: 'hashtag-stats', topic: '#',       direction: 'in' },
			{ channel: 'search',        topic: 'started', direction: 'in' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/

		var main = {
			postal : postal
		};

		var initd = false;

		$(function(){

			postal.subscribe({
				channel  : "search",
				topic    : "started",
				callback : function() {
					postal.subscribe({
						channel  : "hashtag-stats",
						topic    : "count.by.hashtag",
						callback : function(){
							$('body').toggleClass("loading");
						}
					}).once();
					$("#hashCloud" ).html("");
					$('body').toggleClass("loading");
				}
			});

			main.presenter = new TagCloudPresenter(new TagCloudViewModel(), $("#cloud"));
			main.presenter.init();
		});

		postal.fedx.signalReady();

		return main;
	});
});