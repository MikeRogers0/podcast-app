/**
 * Used to manage storage of local files.
 */
var FilesCollection = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("FilesCollection-bb"),

	// I this build is allowed to cache, set this to true on PhoneGap Builds.
	canCache = false,

	initialize: function () {
		if(this.canCache){
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.onFileSystemFail);
		}
    },

    onFileSystemSuccess: function(fileSystem){
    	console.log(fileSystem.name);
        console.log(fileSystem.root.name);
    },

    onFileSystemFail: function(evt){
    	console.log(evt.target.error.code);
    },

	errorHandler: function(e) {
		var msg = '';

		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
			case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
			case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
			case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
			case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
			default:
			msg = 'Unknown Error';
			break;
		};

		console.log('Error: ' + msg);
	},

    getCachedURL: function(url){
		var file = this.where({url:url})[0];

		if(file == null || !file.get('cached')){
			return url;
		}
		return file.get('cacheLocation');
    },

    cacheFile: function(url){
    	var _this = this,
    	file = new FileModel({url:url});
    }
});