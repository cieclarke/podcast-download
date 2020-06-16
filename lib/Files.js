const ffmetadata = require("ffmetadata");
const fs = require('fs');
const path = require("path")

class Files {
    constructor(dir) {
        this.dir = dir;
    } 

    All() {
        let files = this._getAllFiles(this.dir);
        let p = [];
        files.forEach((file, index, arr) => {
            if(/.*\.mp3$/.test(file)) {
                p.push(
                    new Promise((resolve, reject) => {
                        ffmetadata.read(file, (err, data) => {
                            resolve({'file': file, 'data': data});
                        });
                    })
                );
            }
        })

        return Promise.all(p);      
    }

    _getAllFiles(dirPath, arrayOfFiles) {
        const files = fs.readdirSync(dirPath)
        const self = this;
        arrayOfFiles = arrayOfFiles || []

        files.forEach(function(file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = self._getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath, file))
            }
        })

        return arrayOfFiles
    }

}

module.exports = Files;