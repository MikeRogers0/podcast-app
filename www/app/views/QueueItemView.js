QueueItemView = PodcastItemView.extend({
    // Any changes here.

    render: function(){
        // Create the HTML
        
        var template = this.template({
            /*podcast: _.extend(this.model.podcast.attributes, {
                imageUrl: filesItems.getFile(this.model.podcast.get('imageUrl'))
            }),
            episode: _.extend(
                this.model.attributes, 
                {
                    playing: (app.Player ? app.Player.isCurrentlyPlaying(this.model.get('id')) : false),
                    percentCompleted: this.model.percentCompleted()
                }
            ),*/
            podcast: this.model.podcast,
            episode: this.model,
        });


        this.$el.html(template);

        this.$el.attr('data-model-id', this.model.get('id'));
        this.$el.attr('data-model-queuePosition', this.model.get('queuePosition'));

        //this.$el.draggable({appendTo: "ul"});

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

});