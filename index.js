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
            const extantfile = files.find((file, index, arr) => {
                return file.data.artist == podcast.artist &&
                file.data.album == podcast.album &&
                file.data.guid == podcast.guid; 
            });
            
            if(extantfile === undefined) {
                const podcastFiles = new PodcastFiles(podcast, podcastDir);
                queue.add(() => { return podcastFiles.Write(); });
            } else {
                console.log('exists: ' + extantfile.file);
            }
        });
        
    });
    e.Start();
});

f.Start();
