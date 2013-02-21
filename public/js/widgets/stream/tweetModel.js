define([
	'backbone',
    'moment'
], function(Backbone, moment) {
	return Backbone.Model.extend({
		parse: function(data) {
			data.unixTimeStamp = moment(data.created_at).toDate().getTime();
			if(data.profile_image_url === "http://twitter.com/images/default_profile_normal.png" ||
			   data.profile_image_url === "http://static.twitter.com/images/default_profile_normal.png") {
				data.profile_image_url = "templates/images/default_profile_1_normal.png";
			}
			return data;
		}
	});
});