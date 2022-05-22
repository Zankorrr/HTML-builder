const path = require("path");
const fs = require("fs");
const { stat } = require("fs");

fs.rm(path.join(__dirname, "files-copy"), { recursive: true }, () => {
  fs.promises
    .mkdir(path.join(__dirname, "files-copy"), { recursive: true })
    .then();
  fs.promises
    .readdir(path.join(__dirname, "files"), { withFileTypes: true })
    .then((files) => {
      for (let file of files) {
        stat(path.join(__dirname, "files", file.name), () => {
          fs.promises.copyFile(
            path.join(__dirname, "files", file.name),
            path.join(__dirname, "files-copy", file.name)
          );
        });
      }
    });
});
