const path = require("path");
const fs = require("fs");
const { stat } = require("fs");

const readline = require("readline");

fs.rm(path.join(__dirname, "project-dist"), { recursive: true }, () => {
  fs.promises
    .mkdir(path.join(__dirname, "project-dist", "assets"), { recursive: true })
    .then(() => {
      fs.writeFile(
        path.join(__dirname, "project-dist", "index.html"),
        "",
        () => {
          ////////////////////////////////////////

          fs.readFile(
            path.join(__dirname, "template.html"),
            function (err, data) {
              if (err) throw err;
              let array = data.toString().split("\n");
              for (i in array) {
                if (array[i].trim() == "{{header}}") {
                  fs.promises
                    .readFile(
                      path.join(__dirname, "components", "header.html"),
                      "utf-8"
                    )
                    .then(() => {
                      array[i] = data;
                    });
                }
                fs.promises
                  .appendFile(
                    path.join(__dirname, "project-dist", "index.html"),
                    array[i] + "\n"
                  )
                  .then();
              }
            }
          );

          ///////////////////////////////////////////

          fs.writeFile(
            path.join(__dirname, "project-dist", "style.css"),
            "",
            () => {
              fs.promises
                .readdir(path.join(__dirname, "styles"), {
                  withFileTypes: true,
                })
                .then((styles) => {
                  for (let style of styles) {
                    if (
                      style.isFile() &&
                      path.parse(style.name).ext == ".css"
                    ) {
                      const streamStyle = fs.createReadStream(
                        path.join(__dirname, "styles", style.name),
                        "utf-8"
                      );
                      let data = "";
                      streamStyle.on("data", (chunk) => (data += chunk));
                      streamStyle.on("end", () =>
                        fs.appendFile(
                          path.join(__dirname, "project-dist", "style.css"),
                          data,
                          () => {}
                        )
                      );
                    }
                  }
                });
            }
          );
        }
      );
    });
  fs.promises.readdir(path.join(__dirname, "assets")).then((els) => {
    for (let el of els) {
      fs.promises.readdir(path.join(__dirname, "assets", el)).then((files) => {
        for (let file of files) {
          stat(path.join(__dirname, "assets", el, file), () => {
            fs.promises
              .mkdir(path.join(__dirname, "project-dist", "assets", el), {
                recursive: true,
              })
              .then();
            fs.promises.copyFile(
              path.join(__dirname, "assets", el, file),
              path.join(__dirname, "project-dist", "assets", el, file)
            );
          });
        }
      });
    }
  });
});
