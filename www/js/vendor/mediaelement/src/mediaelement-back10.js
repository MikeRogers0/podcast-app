(function($) {
    // loop toggle
    MediaElementPlayer.prototype.buildback10 = function(player, controls, layers, media) {
        var
            // create the loop button
            loop =  
            $('<div class="mejs-button mejs-time mejs-back10-button">' +
                '<span class="batch" data-icon="&#xF169;"></span>' +
            '</div>') 
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {

                player.options.back10();
                
            });     
    }
})(jQuery);