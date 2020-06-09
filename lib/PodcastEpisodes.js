
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
    });
  };

  Start() {
    console.time();
    const self = this;
    this._FromRSS(this.feed).then((d) => {
      if(Array.isArray(d)) {
        
        d.forEach((item, index, arr) => {
          self.emit('data', item, console.timeLog('episode'));
        })
      } else {
        self.emit('data', d, console.timeLog('episode'));
      }  
    });
  }

}

module.exports = PodcastEpisodes;