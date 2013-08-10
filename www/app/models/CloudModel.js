/**
 * The cloud functions other models can extend from.
 */
CloudModel = Backbone.Model.extend({
	cloudSave: function(){
		this.cloudSync('update');
	},
	cloudSync: function(method, options){
		// If dropbox isn't on ignore the request.
		if(!settings.canDropbox()){
			return false;
		}

		// Make sure we don't sync to often.
		if((new Date(this.get('modelUpdatedAt'))  - new Date()) >= -60000){
			return false; // Was synced within the last 1 minute.  
		}

		if(options == null){
			options = {};
		}

		//return Backbone.ajaxSync('read', this, options);
		DropBoxSync = new DropBoxStorage(settings.dropboxClient);
		return DropBoxSync.sync(method, this, options);
	},
});