const path = require("path");
const fs = require("fs");
const { stat } = require("fs");

fs.promises
  .readdir(path.join(__dirname, "secret-folder"), { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      stat(path.join(__dirname, "secret-folder", file.name), (err, stats) => {
        if (stats.isFile()) {
          console.log(
            `${path.parse(file.name).name} - ${path.parse(file.name).ext} - ${
              stats.size / 1024
            } kb`
          );
        }
      });
    }
  });
