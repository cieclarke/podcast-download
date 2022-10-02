import events from "events";
import http from "http";

export default class PodcastsFeeds extends events.EventEmitter {
  constructor(configFilePath) {
    super();
    this.configFilePath = configFilePath;
  }

  Start() {
    const self = this;
    http.get(this.configFilePath, (res) => {
      console.info("reading: " + this.configFilePath);

      let configJSON = "";
      res.on("data", (chunk) => {
        configJSON += chunk;
      });

      res.on("end", () => {
        const config = JSON.parse(configJSON);
        config.forEach((podcast) => {
          self.emit("data", podcast);
        });
      });
    });
  }
}
