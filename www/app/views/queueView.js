QueueView = Backbone.View.extend({
        tagName: 'li',
        el: $('#queue'),

        events:{
            'click': 'toggleService'
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)

            this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            // Create the HTML

            this.$el.html(this.model.get('title') + '<span>$' + this.model.get('id') + '</span>');

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        toggleService: function(){
            //this.model.toggle();
        }
    });