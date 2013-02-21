define([
	'backbone',
    'widgets/stream/tweetModel',
    'postal'
], function(Backbone, TweetModel, postal){

	return Backbone.Collection.extend({
		model: TweetModel,

		comparator: function(a, b) {
			return (a.get("unixTimeStamp") > b.get("unixTimeStamp")) ? -1 : (a.get("unixTimeStamp") < b.get("unixTimeStamp")) ? 1 : 0;
		},

		initialize: function() {
			postal.subscribe({
				channel : "search",
				topic   : "batch.results",
				callback: this.loadData
			} ).withContext(this);
		},

		loadData : function(data, envelope) {
			if(data && data.length) {
				_.each(data, function(item) {
					var self = this;
					_.defer(function(){
						self.add.call(self, item, { parse: true });
					});
				}, this);
			}
		}
	});
});