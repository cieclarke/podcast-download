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
            const raw = response.rawBody;
            console.info('raw data length: ' + raw.length);
            resolve(raw);
          }))
        })
      }
      
      _writefile = (podcastData) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(this.dir + this.podcast.title + '.mp3', podcastData, (err) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            const file = this.dir + this.podcast.title + '.mp3'
            console.info(file);
            resolve(file);
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
            if (err) {
              console.error(err);
              reject(err);
            }
            else {
              console.info('write file data: ' + file)
              resolve(file);
            }
          });
        });
      
      }

    async Write() {
        return this._raw(this.podcast).then((rawdata) => {
            return this._writefile(rawdata);
        }).then((file) => {
            return this._writefiledata(file);
        }).catch((err) => {
          console.error(err)
        });
    }

    Delete(file) {
      fs.unlink(this.dir + filepath);
    }
}  
  
module.exports = PodcastFiles;