(function($) {
    // loop toggle
    MediaElementPlayer.prototype.buildskip = function(player, controls, layers, media) {
        debugger;
        var
            // create the loop button
            loop =  
            $('<div class="mejs-button mejs-time mejs-skip-button">' +
                '<span class="batch" data-icon="&#xF16E;"></span>' +
            '</div>') 
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {
                player.options.skip();
            });     
    }
})(jQuery);