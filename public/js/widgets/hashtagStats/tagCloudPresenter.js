define([
	'knockout',
    'underscore',
    'monopost'
], function(ko, _, Monologue) {
	var TagCloudPresenter = function(vm, $target) {
		this.vm = vm;
		this.$target = $target;
		this.initd = false;
		this.goLocal({ "search started" : "reset" });
	};
	_.extend(TagCloudPresenter.prototype, Monologue.prototype, {
		init : function() {
			var self = this;
			ko.applyBindings(self.vm);
			self.vm.on("tags.updated", function(){
				if(!self.initd) {
					if( ! self.$target.tagcanvas({
						depth            : 0.75,
						initial          : [0.1,-0.1],
						maxSpeed         : 0.03,
						minSpeed         : 0.01,
						minBrightness    : 0.1,
						outlineThickness : 1,
						textColour       : '#00f',
						textFont         : 'Impact, Arial, sans-serif',
						textHeight       : 18,
						weight           : true,
						weightFrom       : "data-weight",
						weightMode       : "colour",
						weightGradient   : {
							0:    'rgba(19, 60, 172, 0.25)',
							0.33: 'rgba(19, 60, 172, 0.50)',
							0.66: 'rgba(19, 60, 172, 0.75)',
							1:    'rgba(19, 60, 172, 0.98)'
						}
					}, 'tags')) {
						self.emit("error");
					}
					self.initd = true;
				} else {
					self.$target.tagcanvas("update");
				}
			});
		},
		reset : function() {
			this.vm.tags([]);
			this.$target.tagcanvas("Reload");
			this.initd = false;
		}
	});

	return TagCloudPresenter;
});