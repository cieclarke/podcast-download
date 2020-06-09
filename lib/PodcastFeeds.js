var EventEmitter = require('events').EventEmitter;
const fs = require('fs');

class PodcastsFeeds extends EventEmitter {

    constructor(configFilePath) { 
      super();
      this.configFilePath = configFilePath;
    }

    Start() {
      const self = this;
      fs.readFile(this.configFilePath, (err, data) => {
        const config = JSON.parse(data);
        config.podcasts.forEach(podcast => {
          self.emit('data', podcast);
        });
      });
    }
}

module.exports = PodcastsFeeds;