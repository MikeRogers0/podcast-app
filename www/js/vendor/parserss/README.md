`$parseRSS` requires a `paramsObj` that consists of 3 variables: `url`, `count`, and `callback`.

**paramsObj.url (string)** - the url to your RSS feed

**paramsObj.count (integer)** - the number of entries to return

**paramsObj.callback (function)** - do stuff with the returned JSON data


Consider the following example:

```
$parseRSS({
    url: "http://blog.donovanglover.com/feed/",
    count: 10,
    callback: function(posts) {
        console.log(posts);
    }
});
```

Still need help? Head over to the [official post](http://blog.donovanglover.com/2013/02/jquery-get-rss-feed/).
