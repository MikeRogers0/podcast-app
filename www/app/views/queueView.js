QueueView = Backbone.View.extend({
        tagName: 'li',

        events:{
            'click': 'toggleService'
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)

            //this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            // Create the HTML
            this.$el.html(this.model.episode.get('title') + ' - '+ this.model.podcast.get('title') +' <em> ID: ' + this.model.episode.get('id') + '</em>');

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        toggleService: function(){
            //this.model.toggle();
        }
    });