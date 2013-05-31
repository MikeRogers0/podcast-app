/**********************************************************\
| Copyright (C) 2013 Donovan Glover                        |
| https://bitbucket.org/GloverDonovan/jquery-parserss      |
\**********************************************************/

var $parseRSS = function(paramsObj) {
    var base = "https://ajax.googleapis.com/ajax/services/feed/load",
        params = "?v=1.0&num=" + paramsObj.count + "&callback=?&q=" + paramsObj.url,
        url = base + params;
    $.ajax({
        url: url,
        dataType: "json",
        success: function(data) {
            //comment & change to return feed, not just entries
            //aramsObj.callback(data.responseData.feed.entries);
            aramsObj.callback(data.responseData.feed);
        }
    });
};