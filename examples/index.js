const { Client } = require('../lib/');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  try {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    const accessToken = process.env.ACCESS_TOKEN;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (typeof consumerKey === 'undefined') throw new Error();
    if (typeof consumerSecret === 'undefined') throw new Error();
    if (typeof accessToken === 'undefined') throw new Error();
    if (typeof accessTokenSecret === 'undefined') throw new Error();

    const client = new Client({
      // token credentials
      accessToken,
      accessTokenSecret,
      // client credentials
      consumerKey,
      consumerSecret
    });

    const url = 'https://blog.bouzuya.net/2019/01/01/';

    // POST /1/my/bookmark
    const created = await client.postBookmark({
      comment: 'test',
      // tags: ['a', 'b'],
      url
    });
    console.log(created);

    await sleep(1000);

    // GET /1/my/bookmark
    const got = await client.getBookmark({ url });
    console.log(got);

    await sleep(1000);

    // DELETE /1/my/bookmark
    await client.deleteBookmark({ url });
    console.log('deleted');

    await sleep(1000);

    // GET /1/entry
    const entry = await await client.getEntry({ url });
    console.log(entry);

    await sleep(1000);

    // GET /1/my/tags
    const tags = await client.getTags({});
    console.log(tags);

    await sleep(1000);

    // GET /1/my
    const user = await client.getUser({});
    console.log(user);
  } catch (error) {
    console.error(error);
  }
};

main();
