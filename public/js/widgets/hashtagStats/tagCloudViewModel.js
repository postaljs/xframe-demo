define([
	'knockout',
	'underscore',
	'monopost'
], function(ko, _, Monologue) {
	var TagCloudViewModel = function() {
		this.tags = ko.observableArray();
		this.goLocal({
			"hashtag-stats count.by.hashtag" : "updateTags"
		});
	};
	_.extend(TagCloudViewModel.prototype, Monologue.prototype, {
		updateTags: function(data) {
			var items = data.sort(function(l,r){
				return r.count - l.count;
			}).slice(0,60);
			var max = _.max(items, function(x) {
				return x.count;
			});
			_.each(items, function(x) {
				x.weight = x.count/max.count;
				x.href = "https://twitter.com/search?q=" + encodeURIComponent(x.hashtag) + "&src=typd";
			});
			this.tags( items );
			this.emit("tags.updated");
		}
	});
	return TagCloudViewModel;
});