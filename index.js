const fs = require('fs');

const PodcastFiles = require('./lib/PodcastFiles');
const Feed = require('./lib/PodcastFeeds');
const Episodes = require('./lib/PodcastEpisodes');
const Files = require('./lib/Files');
const Queue = require('promise-queue');
const cron = require('node-cron');

const run = (configPath, dir) => {

    const queue = new Queue(1, Infinity);
    const f = new Feed(configPath);
    const files = new Files(dir);
    const currentFiles = files.All();

    f.on('data', (d) => {
        const e = new Episodes(d);
        e.on('data', (podcast) => {
            currentFiles.then((files) => {
                const file = files.find((file, index, arr) => {
                    if(file.data != undefined) {
                        return file.data.artist == podcast.artist &&
                        file.data.album == podcast.album &&
                        file.data.guid == podcast.guid; 
                    } else {
                        return false;
                    }
                });
                
                if(file !== undefined) {
                    console.log('exists: ' + podcast.guid);
                } else {
                    console.log('writing: ' + podcast.guid + ' in ' + dir);
                    const podcastFiles = new PodcastFiles(podcast, dir);
                    queue.add(() => { return podcastFiles.Write(); });
                    console.log(queue.getQueueLength());
                    console.log(queue.getPendingLength());
                }
            });
            
        });

        e.Start().then((podcasts) => {

            currentFiles.then((currentFile) => {
                
                podcasts.every((podcast) => {
                    let f = currentFile.filter((file) => {
                        if(file.data != undefined) {
                            return podcast.artist === file.data.artist &&
                            podcast.album === file.data.album &&
                            podcast.genre === file.data.genre;
                        } else {
                            return false;
                        }
                    });
                    
                    return f.every((file) => {
                        let fileGuid = file.data.guid;
                        let podcastsGuids = podcasts.map((podcast) => { return podcast.guid; });

                        if(!podcastsGuids.includes(fileGuid)) {
                            //console.log('delete');
                            //console.log(file);
                            fs.unlink(file.file, () => {} );
                            return false;
                        }
                        return true;

                    });
                });

            });

        });

    });

    f.Start();
}

if (!cron.validate(process.env.PODCAST_RUN_TIME)) {
    run(process.env.PODCAST_FEEDS, process.env.PODCAST_DIR);
} else {
    cron.schedule(process.env.PODCAST_RUN_TIME, () => {
        run(process.env.PODCAST_FEEDS, process.env.PODCAST_DIR);
    });
}

            //all feed files in disk
            //const filesOnDiskForPodcast = files.filter((file, index, arr) => {
            //    return file.data.artist == podcast.artist &&
            //    file.data.album == podcast.album; 
            //}).sort((a, b) => {
            //    const d1 = new Date(a.pubDate);
            //    const d2 = new Date(b.pubDate);
            //    return d2 < d1;
            //  });
