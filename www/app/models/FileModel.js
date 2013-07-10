/**
 * Used to manage storage of local files.
 */
var FileModel = Backbone.Model.extend({
	
	defaults: function() {
		return {
			url: null, // The URL of the file we're caching
			cached: false, // if it's been cached
			cacheURL: null, // It's local URL.
			fileName: null, // Local filename
		};
	},

	initialize: function () {
		this.on('change', function(){this.save();});
	},
});