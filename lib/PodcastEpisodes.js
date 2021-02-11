
const Parser = require('rss-parser');
const parser = new Parser();
var EventEmitter = require('events').EventEmitter;

class PodcastEpisodes extends EventEmitter {

  constructor(feed) {
    super();
    this.feed = feed;
    this.podcasts = [];
  }
    
  _FromRSS(podcast) {
    return parser.parseURL(podcast.url).then((feed) => {
      console.info('album: ' + podcast.album  + '; artist: ' + podcast.artist);
      let p = feed.items.map((item, index, arr) => {
        return {
          guid: item.guid,
          title: item.title,
          genre: 'Podcast',
          pubDate: item.isoDate ?? item.pubDate,
          url: item.enclosure.url,
          artist: podcast.artist,
          album: podcast.album,
          id: podcast.id
        }
      });
    
        p = p.sort((a, b) => {
          const d1 = new Date(a.pubDate);
          const d2 = new Date(b.pubDate);
          return d2 < d1;
        });

        this.podcasts = p.slice(0, podcast.recent);
        return this.podcasts;
    }).catch((err) => {
      console.error(err);
    });
  };

  Start() {
    const self = this;
    return this._FromRSS(this.feed).then((d) => {
      if(Array.isArray(d)) {
        
        d.forEach((podcast, index, arr) => {
          self.emit('data', podcast);
        });
      } else {
        self.emit('data', d);
      }
      
    }).then(() => {
      return self.podcasts;
    });

  }

}

module.exports = PodcastEpisodes;