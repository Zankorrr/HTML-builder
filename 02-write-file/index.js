const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = require("process");

stdout.write("Hi, type something and press Enter\n");
fs.writeFile(path.join(__dirname, "text.txt"), "", () => {});
stdin.on("data", (data) => {
  let str = data.toString().trim();
  if (str == "exit") {
    stdout.write("Well, goodbye\n");
    exit();
  }
  fs.appendFile(path.join(__dirname, "text.txt"), data, () => {
    stdout.write("Anything else?\n");
  });
});
process.on("SIGINT", () => {
  stdout.write("\nWell, goodbye\n");
  exit();
});
