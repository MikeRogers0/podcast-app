var PodcastList = Backbone.Collection.extend({
	model: Podcast,
	
	getByID: function(podcastID){
		return this.where({podcastID:podcastID});
    }
});