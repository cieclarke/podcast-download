const fs = require('fs');

const PodcastFiles = require('./lib/PodcastFiles');
const Feed = require('./lib/PodcastFeeds');
const Episodes = require('./lib/PodcastEpisodes');
const Files = require('./lib/Files');
const Queue = require('promise-queue');

const podcastDir = process.env.PODCAST_DIR;
const feedFilePath = process.env.PODCAST_FEEDS;
const queue = new Queue(1, Infinity);
const f = new Feed(feedFilePath);
const files = new Files(podcastDir);
const currentFiles = files.All();

f.on('data', (d) => {
    const e = new Episodes(d);
    e.on('data', (podcast) => {
        currentFiles.then((files) => {
            const file = files.find((file, index, arr) => {
                return file.data.artist == podcast.artist &&
                file.data.album == podcast.album &&
                file.data.guid == podcast.guid; 
            });
            
            if(file !== undefined) {
                console.log('exists: ' + podcast.guid);
            } else {
                console.log('writing: ' + podcast.guid + ' in ' + podcastDir);
                const podcastFiles = new PodcastFiles(podcast, podcastDir);
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
                    return podcast.artist === file.data.artist &&
                    podcast.album === file.data.album &&
                    podcast.genre === file.data.genre;
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


            //all feed files in disk
            //const filesOnDiskForPodcast = files.filter((file, index, arr) => {
            //    return file.data.artist == podcast.artist &&
            //    file.data.album == podcast.album; 
            //}).sort((a, b) => {
            //    const d1 = new Date(a.pubDate);
            //    const d2 = new Date(b.pubDate);
            //    return d2 < d1;
            //  });
