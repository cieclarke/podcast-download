
const Parser = require('rss-parser');
const parser = new Parser();
var EventEmitter = require('events').EventEmitter;

class PodcastEpisodes extends EventEmitter {

  constructor(feed) {
    super();
    this.feed = feed;
  }
    
  _FromRSS(podcast) {
    return parser.parseURL(podcast.url).then((feed) => {
      console.info('album: ' + podcast.album  + '; artist: ' + podcast.artist);
      let p = feed.items.map((item, index, arr) => {
        return {
          guid: item.guid,
          title: item.title,
          genre: 'Podcast',
          pubDate: item.isoDate,
          url: item.enclosure.url,
          artist: podcast.artist,
          album: podcast.album,
          id: podcast.id
        }
      })
    
        p = p.sort((a, b) => {
          const d1 = new Date(a.pubDate);
          const d2 = new Date(b.pubDate);
          return d2 < d1;
        })

        p = p.slice(0, podcast.recent)
        return p;
    }).catch((err) => {
      console.error(err);
    });
  };

  Start() {
    const self = this;
    this._FromRSS(this.feed).then((d) => {
      if(Array.isArray(d)) {
        
        d.forEach((item, index, arr) => {
          self.emit('data', item);
        })
      } else {
        self.emit('data', d);
      }  
    });
  }

}

module.exports = PodcastEpisodes;