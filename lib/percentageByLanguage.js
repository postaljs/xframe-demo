module.exports = function(_, Monologue) {
	var PercentByLanguage = function() {
		this.counts = { _total: 0 };
		this.percentages = {};
		this.initialize();
	};

	_.extend(PercentByLanguage.prototype, Monologue.prototype, {
		initialize: function() {
			this.goLocal({
				"search start"         : "reset",
				"search batch.results" : "process"
			});
			this.goPostal("language-stats");
		},
		reset: function() {
			this.counts = { _total: 0 };
			this.percentages = {};
		},
		process: function(data, envelope) {
			_.each(data, function(tweet){
				if(tweet.iso_language_code){
					this.counts._total += 1;
					this.counts[tweet.iso_language_code] = (this.counts[tweet.iso_language_code] || 0) + 1;
					this.percentages[tweet.iso_language_code] = this.counts._total ? (this.counts[tweet.iso_language_code] / this.counts._total) : 0;
				}
			}, this);
			this.emit("percent.by.language", this.percentages);
		}
	});

	return PercentByLanguage;
};