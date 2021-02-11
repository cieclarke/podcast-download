var EventEmitter = require('events').EventEmitter;
const http = require('http');

class PodcastsFeeds extends EventEmitter {

    constructor(configFilePath) { 
      super();
      this.configFilePath = configFilePath;
    }

    Start() {
      const self = this;
      http.get(this.configFilePath, (res) => {
        console.info('reading: ' + this.configFilePath)

        let configJSON = '';
        res.on('data', (chunk) => { configJSON += chunk; });

        res.on('end', () => { 
            const config = JSON.parse(configJSON);
            config.forEach(podcast => {
              self.emit('data', podcast);
            });       
        });

      });
    }
}

module.exports = PodcastsFeeds;