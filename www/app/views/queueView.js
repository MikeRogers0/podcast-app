QueueView = Backbone.View.extend({
        tagName: 'li',

        // Cache the template function for a single item.
        template: _.template($('#episodes-template').html()),

        events:{
            'click .play': 'play',
            'click .queue': 'queue',
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)

            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function(){
            // Create the HTML
            var template = this.template({
                playing: false, // Pull it from the player collection / model.
                queued: true, // Get from queue model.
                playhead: this.model.episode.get('playhead'),
                duration: this.model.episode.get('duration'),
                episode_title: this.model.episode.get('title'), 
                podcast_title: this.model.podcast.get('title')
            });

            this.$el.html(template);

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        play: function(){
            this.model.episode.play();
        },
        queue: function(){
            this.model.episode.queue();
        },
    });