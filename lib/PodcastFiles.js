const fs = require('fs');
const path = require('path');
const got = require('got');
const ffmetadata = require("ffmetadata");
  
class PodcastFiles {
    constructor(podcast, dir) {
        this.podcast = podcast;
        this.dir = dir;
    }

    _raw = () => {
        return new Promise((resolve, reject) => {
          return got(this.podcast.url).then((response => {
            const raw = response.rawBody;
            console.info('raw data length: ' + raw.length);
            resolve(raw);
          })).catch((err) => console.error(err))
        })
      }

      _writeDir = () => {
        const folder = path.join(this.dir, this.podcast.artist);
        return new Promise((resolve, reject) => {
          fs.stat(folder, (err, stats) => {
            if(err) {
              console.info('path to create: ' + err.path);
              fs.mkdir(err.path, {"recursive": true}, (err, folder) => {
                if(err) reject(err)
                resolve(folder);
              });
            } else {
              resolve(folder)
            }
          });
        });
      }
      
      _writefile = (podcastData) => {
        return this._writeDir().then((folder) => {

          return new Promise((resolve, reject) => {
            const file = path.join(folder, this.podcast.title + '.mp3');
            fs.writeFile(file, podcastData, (err) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              console.info(file);
              resolve(file);
            });            
          });
        });

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
        const filepath = path.join(this.dir, this.podcast.artist, this.podcast.title + '.mp3');
        return new Promise((resolve, reject) => {
          ffmetadata.write(filepath, data, function(err) {
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