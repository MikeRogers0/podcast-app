PodcastListItemView = Backbone.View.extend({
    tagName: 'li',

    events:{
        //'click a.playPause': 'playPause',
        //'click a.queue': 'queueToggle',
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
            podcast: this.model
        });

        this.$el.html(template);

        this.addThumbnail();

        // Returning the object is a good practice
        // that makes chaining possible
        return this;
    },

    addThumbnail: function(){
        var aLink = this.$el.find('a'),
        img = new Image();

        // Load the thumbnail
        img.onload = function(e){
            var copyCanvas = document.createElement("canvas"),
            copyCtx = copyCanvas.getContext("2d"),
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

            canvas.width = 120;
            canvas.height= 120;

            copyCanvas.width = this.width;
            copyCanvas.height = this.height;
            copyCtx.drawImage(img,0,0);

            ctx.drawImage(copyCanvas, 0, 0, 120, 120);

            aLink.append(canvas);
        }

        img.src = this.model.getImageURI();
    }
});