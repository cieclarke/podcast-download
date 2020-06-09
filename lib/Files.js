const ffmetadata = require("ffmetadata");
const fs = require('fs');
const _ = require('lodash');


class Files {
    constructor(dir) {
        this.dir = /.*\/$/.test(dir) ? dir : dir + '/';;
    } 

    All() {
        let p = [];
        const _dir = /.*\/$/.test(this.dir) ? this.dir : this.dir + '/';
        _.forEach(fs.readdirSync(this.dir), (file) => {
            if(/.*\.mp3$/.test(file)) {
                p.push(
                    new Promise((resolve, reject) => {
                        ffmetadata.read(_dir + file, (err, data) => {
                            resolve({'file': file, 'data': data});
                        });
                    })
                );
            }
        });

        return Promise.all(p);      
    }

}

module.exports = Files;