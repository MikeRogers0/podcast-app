var QueueList = Backbone.Collection.extend({
	model: Queue,

	localStorage: new Backbone.LocalStorage("QueueList-bb"),
	
	getByID: function(id){
		return this.where({id:id})[0];
    },
    nextID: function() {
      if (!this.length) return 1;
      return this.last().get('id') + 1;
    }
});

//var queuedItems = new QueueList();