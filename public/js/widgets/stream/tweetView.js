define([
	'backbrace',
	'underscore',
    'text!widgets/stream/tweetTemplate.html'
], function(backbrace, _, template) {
	return backbrace.View.extend({
		template: _.template(template),

		render: function() {
			this.$el.html(this.template(this.dataToJSON()));
		}
	});
});