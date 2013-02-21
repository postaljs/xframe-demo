module.exports = function(_, Monologue) {
	var CountByUser = function() {
		this.counts = {};
		this.initialize();
	};

	_.extend(CountByUser.prototype, Monologue.prototype, {
		initialize: function() {
			this.goLocal({
				"search start"         : "reset",
				"search batch.results" : "process"
			});
			this.goPostal("user-stats");
		},
		reset: function() {
			this.counts = {};
		},
		process: function(data, envelope) {
			_.each(data, function(tweet){
				if(tweet.from_user){
					this.counts[tweet.from_user] = (this.counts[tweet.from_user] || 0) + 1;
				}
			}, this);
			this.emit("count.by.user", this.counts);
		}
	});

	return CountByUser;
};