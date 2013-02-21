// THIS MODULE ISN'T BEING USED **YET**

require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'jquery',
	    'postal.xframe'
	], function($, postal) {

		postal.instanceId("user-stats");
		postal.fedx.addFilter([
			{ channel: 'user-stats', topic: '#',       direction: 'in' },
		    { channel: 'search',     topic: 'started', direction: 'in' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/
	});
});