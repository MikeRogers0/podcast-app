/*global Backbone variable */
var app = {};

// Head.js loads in all our libarys async, then excutes the in order.
head.js(
	// Load in any libarys we might want.
	'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', // We might want to ditch this later. For now lets just code.
	'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
	'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js',

	// LocalStorage plugin for backbone
	'/js/vendor/backbone.localStorage-min.js',

	// Now load up the models
	'/app/models/episode.js',
	'/app/models/podcast.js',
	'/app/models/queue.js',

	// The collections
	'/app/collections/queueList.js',
	'/app/collections/podcastList.js',
	'/app/collections/episodeList.js',

	// The Views
	'/app/views/queueView.js',

	// Some data
	'/app/mockdata/queue.js',

	function(){
		var App = Backbone.View.extend({
			el: $('#podcast-app'),
			queue: $('ul#queue'),

			initialize: function(){

				queuedItems.each(function(queued){
					var view = new QueueView({ model: queued });
					
	                this.queue.append(view.render().el);
            	}, this);
			},
			render: function(){
				return this;
			}
		});

		app = new App();
	}
);