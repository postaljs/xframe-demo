module.exports = function(_, Monologue) {
	var rgx = /#(\w*)/g;

	var CountByHashtag = function() {
		this.counts = {};
		this.initialize();
	};

	_.extend(CountByHashtag.prototype, Monologue.prototype, {
		initialize: function() {
			this.goLocal({
				"search start"         : "reset",
				"search batch.results" : "process"
			});
			this.goPostal("hashtag-stats");
		},
		reset: function() {
			this.counts = {};
		},
		process: function(data, envelope) {
			_.each(data, function(tweet){
				var res, hashtag;
				while(res = rgx.exec(tweet.text)){
					if(res[1]) {
						hashtag = res[0].toLowerCase();
						this.counts[hashtag] = (this.counts[hashtag] || 0) + 1;
					}
				}
			}, this);
			this.emit("count.by.hashtag", _.map(this.counts, function(value, key){
				return { hashtag: key, count: value };
			}));
		}
	});

	return CountByHashtag;
};