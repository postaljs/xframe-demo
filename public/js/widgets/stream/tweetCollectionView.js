define([
	'backbrace',
    'widgets/stream/tweetView',
    'postal'
], function(backbrace, TweetView, postal) {
	return backbrace.CollectionView.extend({

		el: "#tweets",

		viewType: TweetView,

		initialize: function() {
			postal.subscribe({
				"channel" : "search",
				"topic"   : "started",
				callback  : this.removeAllChildren
			} ).withContext(this);
		},

		renderChildAction: function(view, index) {
			view.render();

			var elem = this.$(' > div:eq(' + index + ')');
			if(elem && elem.length) {
				elem.before(view.$el);
			}
			else {
				this.$el.append(view.$el);
			}
		}
	});
});