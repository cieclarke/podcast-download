const fs = require('fs');
const got = require('got');
const ffmetadata = require("ffmetadata");
  
class PodcastFiles {
    constructor(podcast, dir) {
        this.podcast = podcast;
        this.dir = /.*\/$/.test(dir) ? dir : dir + '/';;
    }

    _raw = () => {
        return new Promise((resolve, reject) => {
          return got(this.podcast.url).then((response => {
            resolve(response.rawBody);
          }))
        })
      }
      
      _writefile = (podcastData) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(this.dir + this.podcast.title + '.mp3', podcastData, (err) => {
            if (err) reject(err);
            resolve(this.dir + this.podcast.title + '.mp3');
          });
        })
      }
      
      _writefiledata = (file) => {
        const data = {
          title: this.podcast.title,
          date: this.podcast.pubDate,
          artist: this.podcast.artist,
          album: this.podcast.album,
          genre: this.podcast.genre,
          guid: this.podcast.guid
        }
      
        return new Promise((resolve, reject) => {
          ffmetadata.write(this.dir + this.podcast.title + '.mp3', data, function(err) {
            if (err) reject(err);
            else resolve(file);
          });
        });
      
      }

    async Write() {
        return this._raw(this.podcast).then((rawdata) => {
            return this._writefile(rawdata);
        }).then((file) => {
            console.info(file);
            return this._writefiledata(file);
        });
    }

    Delete(file) {
      fs.unlink(this.dir + filepath);
    }
}  
  
module.exports = PodcastFiles;