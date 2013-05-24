var PodcastList = Backbone.Collection.extend({
	model: Podcast,
	
	getByID: function(id){
		return this.where({id:id})[0];
    }
});