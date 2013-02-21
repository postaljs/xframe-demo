define([
	'backbone',
	'postal'
], function(Backbone, postal) {
	return Backbone.View.extend({

		el: $('body'),

		initialize: function() {
			this.search = postal.channel("search");
			this.search.subscribe("started", this.showLoading).withContext(this);
		},

		showLoading: function() {
			var self = this;
			self.search.subscribe("batch.results", function(){
				self.$el.toggleClass("loading");
			}).once();
			self.$el.toggleClass("loading");
		}
	});
});