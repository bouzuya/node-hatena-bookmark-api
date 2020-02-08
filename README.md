# hatena-bookmark-api

[Hatena Bookmark REST API][hatena-bookmark-rest-api] wrapper for Node.js (unofficial)

[hatena-bookmark-rest-api]: http://developer.hatena.ne.jp/ja/documents/bookmark/apis/rest

## Installation

```bash
npm install hatena-bookmark-api
```

## Usage

```typescript
import { Client } from 'hatena-bookmark-api';

const client = new Client({
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret',
  accessToken: 'accessToken',
  accessTokenSecret: 'accessTokenSecret'
});

// GET /rest/1/my/bookmark
client.getBookmark({ url })
  .then((bookmark) => {
    console.log(bookmark);
  })
```

See: [`examples/`](examples).

## Get Access Token & Secret

```
$ # get consumer_key & secret from http://www.hatena.ne.jp/oauth/develop
$ export CONSUMER_KEY=...
$ export CONSUMER_SECRET=...
$ node scripts/get-access-token.js
https://www.hatena.ne.jp/oauth/authorize?oauth_token=...
listening for callback: localhost:4567
access_token:
...
access_token_secret:
...
```

## Badges

[![npm version][npm-badge-url]][npm-url]
[![Travis CI][travis-ci-badge-url]][travis-ci-url]

[npm-badge-url]: https://img.shields.io/npm/v/hatena-bookmark-api
[npm-url]: https://www.npmjs.com/package/hatena-bookmark-api
[travis-ci-badge-url]: https://img.shields.io/travis/bouzuya/node-hatena-bookmark-api
[travis-ci-url]: https://travis-ci.org/bouzuya/node-hatena-bookmark-api

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
