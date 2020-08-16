const args = process.argv.slice(2);
const got = require("got");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const fs = require("fs");
const url = require("url");
if (!args[0]) {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("run `node kusaki -help` to see the available commands");
    console.log("");
} else if (args[0] == "--help") {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("`-i` - look for video by ID");
    console.log("`-title` - look for video by title (less accurate)");
    console.log("");
} else if (args[0] == "-i" && !args[1]) {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("error! this parameter requires an input");
    console.log("");
} else if (args[0] == "-i" && !ytdl.validateID(args[1])) {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("error! this parameter requires a valid ");
    console.log("YouTube id.");
    console.log("");
} else if (args[0] == "-i" && ytdl.validateID(args[1])) {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("- searching for the entire internet for the id...");
    console.log("");
    if (!fs.existsSync("./json")) {
        fs.mkdirSync("./json/");
    }
    got("https://html.duckduckgo.com/html/?q=" + args[1] + "&attr=video&kl=us-en").then(function(response) {
        var ddg = [];
        var $ = cheerio.load(response.body);
        for (var c in $(".result .links_main h2 a")) {
            if ($(".result .links_main h2 a")[c].children && $(".result .links_main h2 a")[c].children[0] && $(".result .links_main h2 a")[c].children[0].data !== "No  results.") {
                    //^ checks if there url has a name
                if ($(".result .links_main h2 a")[c].attribs && $(".result .links_main h2 a")[c].attribs.href) {
                    var a = url.parse($(".result .links_main h2 a")[c].attribs.href, true).query.uddg;
                    var d = parseInt(c) + 1;
                    console.log("- pushing to array... [result " + d + "]");
                    ddg.push({"linkTitle": $(".result .links_main h2 a")[c].children[0].data, "url": a})
                }
            }
        }
        console.log("");
        console.log("- writing results to json file...");
        console.log("");
        var fn = "./json/data-" + args[1] + ".json"
        if (fs.existsSync(fn)) {
            fs.unlinkSync(fn)
        }
        fs.appendFileSync(fn, "");
        fs.writeFileSync(fn, JSON.stringify(ddg));
        console.log("[!] finished file `" + fn + "`");
        console.log("");
    })
} else if (args[0] == "-title" && !args[1]) {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("error! this parameter requires an input ");
    console.log("(video title).");
    console.log("");
} else if (args[0] == "-title" && args[1]) {
    if (!fs.existsSync("./json")) {
        fs.mkdirSync("./json/");
    }
    var q = "";
    for (var i = 1; i < args.length; i++) {
        q = q + args[i];
    }
    got("https://html.duckduckgo.com/html/?q=" + q + " reupload&attr=video&kl=us-en").then(function(response) {
        var ddg = [];
        var $ = cheerio.load(response.body);
        for (var c in $(".result .links_main h2 a")) {
            if ($(".result .links_main h2 a")[c].children && $(".result .links_main h2 a")[c].children[0] && $(".result .links_main h2 a")[c].children[0].data !== "No  results.") {
                    //^ checks if there url has a name
                if ($(".result .links_main h2 a")[c].attribs && $(".result .links_main h2 a")[c].attribs.href) {
                    var a = url.parse($(".result .links_main h2 a")[c].attribs.href, true).query.uddg;
                    var d = parseInt(c) + 1;
                    console.log("- pushing to array... [result " + d + "]");
                    ddg.push({"linkTitle": $(".result .links_main h2 a")[c].children[0].data, "url": a})
                }
            }
        }
        console.log("");
        console.log("- writing results to json file...");
        console.log("");
        var fn = "./json/data-" + args[1] + ".json"
        if (fs.existsSync(fn)) {
            fs.unlinkSync(fn)
        }
        fs.appendFileSync(fn, "");
        fs.writeFileSync(fn, JSON.stringify(ddg));
        console.log("[!] finished file `" + fn + "`");
        console.log("");
    })
} else {
    console.log("");
    console.log("kusaki - youtube archival tool");
    console.log("===============================");
    console.log("invalid arguments");
    console.log("");
}