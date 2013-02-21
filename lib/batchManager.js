module.exports = function(_, machina, Monologue, io) {
	return machina.Fsm.extend( _.extend({

		initialize: function() {
			this.batch = [];
			this.goLocal({
				"search batch.results"               : "send",
				"language-stats percent.by.language" : "send",
				"hashtag-stats count.by.hashtag"     : "send",
				"search start"                       : "purge"
			});
		},

		initialState: "queueing",

		"*" : function() {
			this.deferUntilTransition();
		},

		states: {
			queueing: {
				_onEnter: function() {
					var self = this;
					self.batch = [];
					self.timer = setTimeout(function(){
						self.handle("queue.timeout");
					}, self.interval || 10000);
				},
				"queue.timeout" : "transmitting",
				send: function(envelope) {
					this.batch.push(envelope);
				},
				_onExit: function() {
					clearTimeout(this.timer);
				}
			},
			transmitting: {
				_onEnter: function() {
					if(this.batch.length) {
						io.sockets.emit( "postal.batch", this.batch );
					}
					this.transition("queueing");
				}
			}
		},

		send : function(data, envelope) {
			this.handle("send", envelope);
		},

		purge: function() {
			console.log("PURGING!")
			this.batch = [];
		}

	}, Monologue.prototype));
};