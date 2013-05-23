var episode = Backbone.Model.extend({

  // Default attributes for an episode
  defaults: function() {
    return {
      title: "Some episode title",
      datePublished: null,
      duration: null,
      podcast: null // The ID of the podcast?
    };
  }

});