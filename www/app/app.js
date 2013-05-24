/*global Backbone variable */
var App = {};

// Head.js loads in all our libarys async, then excutes the in order.
head.js(
	// Load in any libarys we might want.
	'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', // We might want to ditch this later. For now lets just code.
	'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
	'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js',

	// Now load up the models
	'/app/models/episode.js',
	'/app/models/podcast.js',
	'/app/models/queue.js',

	// The collections
	'/app/collections/queueList.js',
	'/app/collections/podcastList.js',
	'/app/collections/episodeList.js',

	// The Views
	'/app/collections/queueView.js',

	// Some data
	'/app/mockdata/queue.js',

	function(){
		App = Backbone.View.extend({
			el: $('#podcast-app'),

			initialize: function(){

			},
			render: function(){
				return this;
			}
		});
	}
 );