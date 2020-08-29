const fs = require("fs");
const args = process.argv.slice(2);
const { Select } = require("enquirer");
const chalk = require("chalk");
if (args[0] == "--file" && args[1]) {
    cls();
    console.log(chalk.yellowBright("- reading file..."));
    read(args[1]);
} else {
    if (fs.existsSync("./json/")) {
        cls();
        var folder = fs.readdirSync("./json/");
        var a = new Select({
            "message": "Select a file to read.",
            "choices": folder
        })
        a.run().then(function(ans) {
            cls();
            console.log(chalk.yellowBright("- reading file..."));
            var file = "./json/" + ans;
            read(file)
        }).catch(function() {
            // to ignore potential errors
        })
    } else {
        cls();
        console.log(chalk.red("run kusaki to find reuploads before running this reader."));
    }
}

function cls() {
    console.clear();
    console.log("");
    console.log(chalk.greenBright("kusaki - youtube archival tool"));
    console.log("===============================");
}

function read(f) {
    if (fs.existsSync(f)) {
        cls();
        console.log("JSON reader: " + chalk.greenBright(f));
        console.log("");
        var json = JSON.parse(fs.readFileSync(f));
        if (json[0]) {
            for (var c in json) {
                if (json[c].source !== undefined) {
                    console.log(chalk.blueBright(json[c].source) + " - " + chalk.greenBright(json[c].link))
                } else {
                    console.log(chalk.greenBright(json[c]));
                }
            }
        }
        console.log("");
    } else {
        cls();
        console.log(chalk.red("failed to find `" + f + "`."))
    }
}