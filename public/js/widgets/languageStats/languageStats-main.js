require.config({ paths: { pathConfig : '/js/infrastructure/pathConfig' }});

require([ 'pathConfig' ], function(){
	require([
		'jquery',
		'underscore',
	    'postal.xframe'
	], function($, _, postal) {

		postal.instanceId("language-stats");
		postal.fedx.addFilter([
			{ channel: 'language-stats', topic: '#',       direction: 'in' },
			{ channel: 'search',         topic: 'started', direction: 'in' }
		]);
		/*postal.addWireTap(function(d, e) {
			console.log("ID: " + postal.instanceId() + " - " + JSON.stringify(e, null, 4));
		});*/

		var colors = [
		   "#133CAC", "#00B358", "#FFAD00", "#8E41D5", "#FFD273", "#F0FC00", "#EA0037", "#062270", "#FF7373"
		];
		var initd = false;

		$(function () {

			postal.subscribe({
				channel  : "search",
				topic    : "started",
				callback : function() {
					initd = false;
					$("#langChart").html("");
					postal.subscribe({
						channel  : "language-stats",
						topic    : "percent.by.language",
						callback : function(){
							$('body').toggleClass("loading");
						}
					}).once();
					$('body').toggleClass("loading");
				}
			});

			postal.subscribe({
				channel  : "language-stats",
				topic    : "percent.by.language",
				callback : function(d, e) {
					// TODO: research why Raphael is undefined in some instances
					if(typeof Raphael === "undefined") {
						return;
					}
					if(!initd) {
						initd = true;
						$("body" ).removeClass('loading');
					}
					var legendKeys = _.reduce(d, function(memo, value, key){
						memo.push(key + " - " + ((value * 100).toFixed(2)) + " %"); // hey, it's just for presentation!
						return memo;
					}, []);
					var values = _.toArray(d);
					$("#langChart").html("");
					var r = Raphael("langChart");
					var pie = r.piechart(250, 150, 100, values, {
						legend: legendKeys,
						legendpos: "west",
						colors: colors
					});

					r.text(250, 20, "Languages").attr({ font: "20px sans-serif" });
					pie.hover(function () {
						this.sector.stop();
						this.sector.scale(1.1, 1.1, this.cx, this.cy);

						if (this.label) {
							this.label[0].stop();
							this.label[0].attr({ r: 7.5 });
							this.label[1].attr({ "font-weight": 800 });
						}
					}, function () {
						this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

						if (this.label) {
							this.label[0].animate({ r: 5 }, 500, "bounce");
							this.label[1].attr({ "font-weight": 400 });
						}
					});
				}
			} ).defer();
		});

		postal.fedx.signalReady();

	});
});