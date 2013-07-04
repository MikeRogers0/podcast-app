(function($) {
    // loop toggle
    MediaElementPlayer.prototype.buildskip = function(player, controls, layers, media) {
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
                /*player.options.back10 = !player.options.back10;
                if (player.options.loop) {
                    loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
                } else {
                    loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                }*/
            });     
    }
})(jQuery);