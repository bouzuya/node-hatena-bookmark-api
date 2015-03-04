# hatena-bookmark-api

[Hatena::Bookmark API][hatena-bookmark-api] wrapper for Node.js (unofficial)

## Usage

### Callback

```
var bookmark = require('hatena-bookmark-api');

var client = bookmark({
  type: 'wsse', // oauth or wsse
  username: 'username',
  apikey: 'apikey'
});

var options = {};
client.index(options, function(err, bookmarks) {
  if (err) {
    console.error(err);
  } else {
    console.log(bookmarks);
  }
});
```

### Promise

```
var bookmark = require('hatena-bookmark-api');

var client = bookmark({
  type: 'oauth', // oauth or wsse
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret',
  token: 'token',
  tokenSecret: 'tokenSecret'
});

var options = { of: 20 };
client.index(options)
.then(function(bookmarks) {
  console.log(bookmarks);
});
```

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

[hatena-bookmark-api]: http://developer.hatena.ne.jp/ja/documents/bookmark
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
