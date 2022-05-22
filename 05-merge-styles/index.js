const path = require("path");
const fs = require("fs");

fs.rm(path.join(__dirname, "project-dist", "bundle.css"), () => {
  fs.promises
    .readdir(path.join(__dirname, "styles"), { withFileTypes: true })
    .then((files) => {
      for (let file of files) {
        if (file.isFile() && path.parse(file.name).ext == ".css") {
          const stream = fs.createReadStream(
            path.join(__dirname, "styles", file.name),
            "utf-8"
          );
          let data = "";
          stream.on("data", (chunk) => (data += chunk));
          stream.on("end", () =>
            fs.appendFile(
              path.join(__dirname, "project-dist", "bundle.css"),
              data,
              () => {}
            )
          );
        }
      }
    });
});
