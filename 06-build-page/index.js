const path = require("path");
const fs = require("fs");
const { stat } = require("fs");

fs.rm(path.join(__dirname, "project-dist"), { recursive: true }, () => {
  fs.promises
    .mkdir(path.join(__dirname, "project-dist", "assets"), { recursive: true })
    .then(() => {
      fs.promises
        .readFile(path.join(__dirname, "template.html"), "utf-8")
        .then((data) => {
          let htmlCode = data;
          fs.promises
            .readdir(path.join(__dirname, "components"))
            .then((files) => {
              for (let file of files) {
                fs.promises
                  .readFile(path.join(__dirname, "components", file), "utf-8")
                  .then((data) => {
                    let sample = `{{${path.parse(file).name}}}`;
                    htmlCode = htmlCode.replace(sample, data);
                    fs.writeFile(
                      path.join(__dirname, "project-dist", "index.html"),
                      htmlCode,
                      () => {
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
                                      path.join(
                                        __dirname,
                                        "styles",
                                        style.name
                                      ),
                                      "utf-8"
                                    );
                                    let data = "";
                                    streamStyle.on(
                                      "data",
                                      (chunk) => (data += chunk + "\n")
                                    );
                                    streamStyle.on("end", () =>
                                      fs.appendFile(
                                        path.join(
                                          __dirname,
                                          "project-dist",
                                          "style.css"
                                        ),
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
              }
            });
        });
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
