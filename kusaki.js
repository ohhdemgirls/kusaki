const got = require("got");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const fs = require("fs");
const url = require("url");
const chalk = require('chalk');
const { Input } = require('enquirer');
console.log("");
console.log("kusaki - youtube archival tool");
console.log("===============================");
console.log("if you don't know certain video details,");
console.log("just leave it blank!");
console.log("");
var i1 = new Input({"message": "YouTube ID"})
i1.run().then(function(a) {
    if (a.toString().substring(0, 4) == "http") {
        if (ytdl.validateURL(a.toString())) {
            var ans1 = ytdl.getURLVideoID(a.toString());
        } else {
            console.log(chalk.red("ERR! Must be an ID or URL."));
            return;
        }
    } else {
        if (ytdl.validateID(a)) {
            var ans1 = a.toString();
        } else {
            console.log(chalk.red("ERR! Must be an ID or URL."));
            return;
        }
    }
    var i2 = new Input({"message": "Video Title"})
    i2.run().then(function(a) {
        const ans2 = a.toString();
        cls();
        console.log(chalk.yellow("- formatting main string..."));
        if (!ytdl.validateID(ans1)) {
            console.log(chalk.red("ERR! The YouTube ID is not valid"));
            return;
        }
        const data = {
            id: ans1,
            title: ans2
        }
        searchArchive(data);
    })
})

function cls() {
    console.clear();
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
}

function searchArchive(string) {
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.yellowBright("- searching archive.org..."));
    if (!string.title) {
        got('https://archive.org/search.php?query="' + string.id + '"&and[]=mediatype%3A"movies"').then(function(response) {
            var $ = cheerio.load(response.body);
            let one = [];
            for (var c in $("div .results div .C234 div a")) {
                if ($("div .results div .C234 div a")[c].attribs && $("div .results div .C234 div a")[c].attribs.href) {
                    if ($("div .results div .C234 div a")[c].attribs.href.includes(string.id)) {
                        one.push("https://archive.org" + $("div .results div .C234 div a")[c].attribs.href)
                    }
                }
            }
            searchPetey(string, one);
        })
    } else {
        got('https://archive.org/search.php?query=' + string.id + ' ' + string.title + '&and[]=mediatype%3A"movies"').then(function(response) {
            var $ = cheerio.load(response.body);
            let one = [];
            for (var c in $("div .results div .C234 div a")) {
                if ($("div .results div .C234 div a")[c].attribs && $("div .results div .C234 div a")[c].attribs.href) {
                    if ($("div .results div .C234 div a")[c].attribs.href.includes(string.id)) {
                        one.push("https://archive.org" + $("div .results div .C234 div a")[c].attribs.href)
                    }
                }
            }
            searchPetey(string, one);
        })
    }
}

function searchPetey(string, old) {
    cls();
    if (!old) {
        var old = [];
    }
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.yellowBright("- searching peteyvid.com..."));
    if (old.length == 1) {
        var logtail = old.length + " video";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail));
    } else if (old.length > 1) {
        var logtail = old.length + " videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail));
    } else {
        var logtail = "0 videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.redBright(logtail));
    }
    if (string.title) {
        got("https://www.peteyvid.com/index.php?q=" + string.title + '"' + string.id + '"').then(function(response) {
            var $ = cheerio.load(response.body);
            for (var c in $("ol li blockquote")) {
                if ($("ol li blockquote")[c].attribs) {
                    if ($("ol li blockquote")[c].attribs.cite !== undefined) {
                        old.push($("ol li blockquote")[c].attribs.cite);
                    }
                }
            }
            searchDailymotion(string, old)
        })
    } else {
        got("https://www.peteyvid.com/index.php?q=" + '"' + string.id + '"').then(function(response) {
            var $ = cheerio.load(response.body);
            for (var c in $("ol li blockquote")) {
                if ($("ol li blockquote")[c].attribs) {
                    if ($("ol li blockquote")[c].attribs.cite !== undefined) {
                        old.push($("ol li blockquote")[c].attribs.cite);
                    }
                }
            }
            finish(string, old)
        })
    }
}

function searchDailymotion(string, old) {
    // WIP
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    console.log(chalk.yellowBright("- searching dailymotion..."));
    //got("")
    finish(string, old);
}

function finish(string, data) {
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    // console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced dailymotion]"));
    console.log(chalk.yellowBright("- writing to json..."));
    var fn = "./json/data-" + string.id + ".json";
    fs.writeFileSync(fn, JSON.stringify(data));
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    // console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced dailymotion]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [wrote to " + fn + "]"));
    console.log("");
    if (data.length == 1) {
        var logtail = data.length + " video";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail));
    } else if (data.length > 1) {
        var logtail = data.length + " videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail));
    } else {
        var logtail = "0 videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.redBright(logtail));
    }
    console.log("");
}