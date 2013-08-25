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
        img = new Image(),
        _this = this;

        // Load the thumbnail
        img.onload = function(e){
            // If we have cached a resized image.
            if(this.width == _this.$el.width() && this.height == _this.$el.height()){
                aLink.append(this);
                return;
            }

            var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

            canvas.width = _this.$el.width();
            canvas.height= _this.$el.height();

            ctx.drawImage(img, 0, 0, _this.$el.width(), _this.$el.height());


            aLink.append(canvas);

            delete this;
        }

        img.src = this.model.getImageURI();
    }
});