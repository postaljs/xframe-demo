define(function(){
	require.config({
		paths: {
			text:                "lib/require/text",
			underscore:          "lib/underscore/lodash",
			backbone:            "lib/backbone/backbone",
			backbrace:           "lib/backbone/backbrace",
			postal:              "lib/postal/postal",
			riveter:             "lib/riveter/riveter",
			monopost:            "lib/postal/monopost",
			monologue:           "lib/postal/monologue",
			"postal.federation": "lib/postal/postal.federation",
			"postal.xframe":     "lib/postal/postal.xframe",
			socketio:            "/socket.io/socket.io.js",
			moment:              "lib/moment/moment.min",
			tagcanvas:           "lib/jquery/jquery.tagcanvas",
			knockout:            "lib/knockout/knockout-2.2.1"
		},
		shim: {
			backbone: {
				"deps": [ "jquery", "underscore" ],
				"exports": "Backbone"
			},
			tagcanvas : {
				"deps" : [ "jquery" ]
			}
		},
		baseUrl: "/js"
	});
});