module.exports = function(_, Monologue) {
	var query = require('querystring');
	var http = require('http');
	var client = http.createClient(80, "demos.kendoui.com");

	function makeRequest(url, callback) {
		var request = client.request("GET", url , {"host": "demos.kendoui.com"});
		request.addListener("response", function(response) {
			var body = "";
			response.addListener("data", function(data) {
				body += data;
			});

			response.addListener("end", function() {
				callback(JSON.parse(body));
			});
		});
		request.end();
	}

	var TwitterSearch = function(refreshInterval) {
		this.timeoutFn = undefined;
		this.searchPath = "/service/Twitter/Search";
		this.refreshInterval = refreshInterval || 5000;
		this.searchRegistry = {};
		this.tweetRegistry = {};
		this.defaultSearch = {};
		this.nextSearch = undefined;
		this.history = [];
		this.goPostal({ "#" : "search" });
		this.goLocal({
			"search start" : "setSearch",
			"search stop"  : "stopSearch"
		});
	};

	_.extend(TwitterSearch.prototype, Monologue.prototype, {
		setSearch : function(searchTerm) {
			this.stopSearch();
			this.emit("search.started", { searchQry: searchTerm });
			this.defaultSearch = {
				q: searchTerm//,
				//result_type: "recent",
				//rpp: 100
			};
			this.searching = true;
			this.runSearch();
		},
		stopSearch : function(){
			if(!this.searching) {
				return this.emit("search.notActive");
			}
			this.emit("search.stopped");
			clearTimeout(this.timeoutFn);
			this.nextSearch = undefined;
			this.searchRegistry = {};
			this.tweetRegistry = {};
			this.history = [];
		},
		buildUrl : function() {
			var srchQry;
			if(this.nextSearch) {
				srchQry = this.nextSearch;
			}
			else {
				if(!this.defaultSearch.since_id) {
					delete this.defaultSearch.since_id;
				}
				srchQry = "?" + query.stringify(this.defaultSearch);
			}
			return this.searchPath + srchQry;
		},
		runSearch : function() {
			var self = this;
			var url = this.buildUrl();
			this.emit("searching.url", url);
			if(!self.searchRegistry[url]) {
				self.searchRegistry[url] = true;
				makeRequest(url, function(results) {
					self.emit("batch.results", self.onSearched(results));
				});
			}
			self.timeoutFn = setTimeout(self.runSearch.bind(self), self.refreshInterval);
		},
		onSearched : function(payload) {
			var results = [];
			if(!payload.error) {
				if(payload && payload.statuses && payload.statuses.length) {
					results = this.processTweets(payload.statuses);
				}
				this.nextSearch = payload.search_metadata && payload.search_metadata.next_results;
				this.defaultSearch.since_id = (payload.search_metadata && payload.search_metadata.max_id) || this.defaultSearch.since_id;
			}
			else {
				this.nextSearch = undefined;
			}
			return results;
		},
		processTweets : function(tweets) {
			var self = this;
			var newTweets = tweets.filter(function(t) { return !this.tweetRegistry[t]; }, this)
			      .reduce(function(prev, cur, idx, arry){
					if(!self.tweetRegistry[cur.id]) {
						self.tweetRegistry[cur.id] = true;
						prev.push({
							id                : cur.id,
							from_user         : cur.user.screen_name,
							from_user_name    : cur.user.name,
							text              : cur.text,
							created_at        : cur.created_at,
							iso_language_code : cur.metadata.iso_language_code,
							profile_image_url : (cur.user.profile_image_url === "http://twitter.com/images/default_profile_normal.png" ||
							                     cur.user.profile_image_url === "http://static.twitter.com/images/default_profile_normal.png") ?
							                    "templates/images/default_profile_1_normal.png" :
							                    cur.user.profile_image_url

						});
					}
					return prev;
				  }, []);
			this.history = this.history.concat(newTweets);
			return newTweets;
		}
	});

	return TwitterSearch;
};