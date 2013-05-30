/*
	From: https://github.com/ccoenraets/nodecellar/blob/master/public/js/utils.js
*/

window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('/app/tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
                //debugger;
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }
}