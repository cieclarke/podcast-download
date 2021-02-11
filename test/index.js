var assert = require('assert');
var Parser = require("rss-parser");
const parser = new Parser();

describe('RSS', function () {
  describe('Feed', function () {

    parser.parseURL("https://rss.podplaystudio.com/1308.xml").then((feed) => {
        console.log(feed);    
    //console.log(feed.items[2]);
    });
    assert.equal([1, 2, 3].indexOf(4), -1);

  });
});