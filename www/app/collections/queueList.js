var QueueList = Backbone.Collection.extend({
	model: Queue,
	
	getByID: function(id){
		return this.where({id:id});
    }
});