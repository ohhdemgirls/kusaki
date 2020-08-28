const got = require("got");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const fs = require("fs");
const args = process.argv.slice(2);
const chalk = require("chalk");
const compare = require("compare-strings");
const { Input } = require('enquirer');
console.log("");
console.log(chalk.greenBright("kusaki - youtube archival tool"));
console.log("===============================");
console.log("if you don't know certain video details,");
console.log("just leave it blank!");
console.log("");
console.log(chalk.red("NOTE!") + chalk.redBright(" This tool requires an ID at the very least!"))
console.log("");
if (args[0] == "--id" && args[1]) {
    var a = args[1];
    console.log(a);
    if (a.substring(0, 4) == "http") {
        if (ytdl.validateURL(a)) {
            var a = ytdl.getURLVideoID(a);
        } else {
            console.log(chalk.red("ERR!") + chalk.redBright(" The '--id' argument must be an ID or URL."));
            return;
        }
    } else {
        if (ytdl.validateID(a)) {
            var a = a;
        } else {
            console.log(chalk.red("ERR!") + chalk.redBright(" The '--id' argument must be an ID or URL."));
            return;
        }
    }
    if (args[2] && args[2] == "--title") {
        var aTitle = extractTitle(args.slice(3));
        var data = {
            id: a,
            title: aTitle
        }
        searchArchive(data);
    } else {
        var data = {
            id: a
        }
        searchArchive(data);
    }
} else {
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
}


function cls() {
    console.clear();
    console.log("");
    console.log(chalk.greenBright("kusaki - youtube archival tool"));
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
                        var d = {
                            "link": "https://archive.org" + $("div .results div .C234 div a")[c].attribs.href,
                            "source": "archive.org"
                        }
                        one.push(d);
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
    makeTail(old.length, old);
    if (string.title) {
        var url = "https://www.peteyvid.com/index.php?q=" + encodeURI(string.title + '"' + string.id + '"');
        got(url, {
            headers: {
                "Host": "www.peteyvid.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.peteyvid.com/index.php",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "DNT": "1",
                "TE": "Trailers"
            }
        }).then(function(response) {
            var $ = cheerio.load(response.body);
            if ($("ol li blockquote").length > 0) {
                for (var c in $("ol li blockquote")) {
                    if ($("ol li blockquote header h3 cite h1 a")[c].children && $("ol li blockquote header h3 cite h1 a")[c].children[0] && $("ol li blockquote header h3 cite h1 a")[c].children[0].data) {
                        var title = $("ol li blockquote header h3 cite h1 a")[c].children[0].data.replace(/\t/g, '');
                        if ($("ol li blockquote")[c].attribs) {
                            if ($("ol li blockquote")[c].attribs.cite !== undefined) {
                                if (compare(string.title, title) > 0.65) {
                                    var d = {
                                        "link": $("ol li blockquote")[c].attribs.cite,
                                        "source": $("ol li .website")[c].children[0].data
                                    }
                                    old.push(d);
                                }
                            }
                        }
                    }
                }
            } else {
                if ($(".captcha_play_button")) {
                    cls();
                    console.log(chalk.yellow("[info]") + chalk.red(" captcha found!"));
                    console.log(chalk.red("please do the captcha in your browser"));
                    console.log(chalk.redBright("at https://www.peteyvid.com/robots.php"));
                    return;
                }
            }
            searchDailymotion(string, old);
        })
    } else {
        got("https://www.peteyvid.com/index.php?q=" + '"' + string.id + '"').then(function(response) {
            var $ = cheerio.load(response.body);
            for (var c in $("ol li blockquote")) {
                if ($("ol li blockquote")[c].attribs) {
                    if ($("ol li blockquote")[c].attribs.cite !== undefined) {
                        var d = {
                            "link": $("ol li blockquote")[c].attribs.cite,
                            "source": $("ol li .website")[c].children[0].data
                        }
                        old.push(d);
                    }
                }
            }
            searchDailymotion(string, old);
        })
    }
}

function searchDailymotion(string, old) {
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    console.log(chalk.yellowBright("- searching dailymotion..."));
    makeTail(old.length, old);
    if (string.title) {
        var q = "site:dailymotion.com " + string.title + ' "' + string.id + '"';
    } else {
        var q = 'site:dailymotion.com  "' + string.id + '"';
    }
    got("https://html.duckduckgo.com/html/?q=" + q, {
        headers: {
            "Host": "html.duckduckgo.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://html.duckduckgo.com/",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "DNT": "1",
            "TE": "Trailers"
        }
    }).then(function (response) {
        var $ = cheerio.load(response.body);
        for (var c in $(".results .result .links_main .result__snippet")) {
            if ($(".results .result .links_main .result__a")[c].children) {
                var title = extractDdgTitle($(".results .result .links_main .result__a")[c].children);
                if (string.title) {
                    if (compare(string.title, title) > 0.65 && $(".results .result .links_main .result__snippet")[c].attribs && $(".results .result .links_main .result__snippet")[c].attribs.href) {
                        var l = $(".results .result .links_main .result__snippet")[c].attribs.href;
                        var d = {
                            "link": l,
                            "source": "dailymotion.com"
                        }
                        old.push(d);
                    }
                } else {
                    if ($(".results .result .links_main .result__snippet")[c].attribs && $(".results .result .links_main .result__snippet")[c].attribs.href) {
                        var l = $(".results .result .links_main .result__snippet")[c].attribs.href;
                        var d = {
                            "link": l,
                            "source": "dailymotion.com"
                        }
                        old.push(d);
                    }
                }
            }
        }
        finish(string, old);
    })
}

function finish(string, data, e, e2) {
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    if (e !== "errDaily") {
        console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced dailymotion]"));
    } else {
        console.log(chalk.redBright("✕") + chalk.red(" failed to get dailymotion results due to an error - " + e2));
    }
    console.log(chalk.yellowBright("- writing to json..."));
    var fn = "./json/data-" + string.id + ".json";
    fs.writeFileSync(fn, JSON.stringify(data));
    cls();
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [formatted string]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced archive.org]"));
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced peteyvid.com]"));
    if (e !== "errDaily") {
        console.log(chalk.greenBright("✓") + chalk.blueBright(" [searced dailymotion]"));
    } else {
        console.log(chalk.redBright("✕") + chalk.red(" failed to get dailymotion results due to an error - " + e2));
    }
    console.log(chalk.greenBright("✓") + chalk.blueBright(" [wrote to " + fn + "]"));
    makeTail(data.length, data);
    console.log("");
}

function extractDdgTitle(string) {
    var result = "";
    for (var c in string) {
        if (string[c].type == "text") {
            var result = result + string[c].data;
        } else if (string[c].type == "tag") {
            if (string[c].name == "b") {
                for (var cc in string[c].children) {
                    var result = result + string[c].children[cc].data;
                }
            }
        }
    }
    return result;
}

function extractTitle(array) {
    var title = "";
    for (var c in array) {
        var title = title + " " + array[c];
    }
    return title;
}

function makeTail(num, data) {
    console.log("");
    if (num == 1) {
        var logtail = num + " video";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail) + " " + srcs(data));
    } else if (num > 1) {
        var logtail = num + " videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.greenBright(logtail) + " " + srcs(data));
    } else {
        var logtail = "0 videos";
        console.log(chalk.yellow("[info]") + " found " + chalk.redBright(logtail));
    }
}

function srcs(data) {
    var src = "";
    for (var c in data) {
        if (!src) {
            var src = "from " + chalk.greenBright(data[c].source);
        } else {
            if (!src.includes(data[c].source)) {
                var src = src + ", " + chalk.greenBright(data[c].source);
            }
        }
    }
    return src;
}