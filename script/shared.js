// Add ucfirst() to String pseudoclass
String.prototype.ucfirst = function () {
    return this.substring(0,1).toUpperCase() + this.slice(1);
}

// FIXME: Probably deprecated
const CRYSTAL       = 0;    // Z3 Blue      Crystal Dungeon Prize
const OJCRYSTAL     = 1;    // Z3 Red       Crystal Dungeon Prize
const OFFPENDANT    = 2;    // Z3 Red/Blue  Pendant Dungeon Prize
const GREENPENDANT  = 3;    // Z3 Green     Pendant Dungeon Prize

const Z1FACTOR      = 4;    // Z1 Map Zoom Factor

// From a URL, with a key name, get the value, if it exists, else return defaultVal
function getParameterByName(name, url, defaultVal) {
    if (!url) url = window.location.href;
    if (!defaultVal && defaultVal !== null) defaultVal = "";
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return defaultVal;
    if (!results[2]) return defaultVal;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var manifests = []; // Hold collected game manifests
var g = "";         // Reusable GameID
var bosses = 0;     // Number of Bosses

// Get selected game, default to zelda3
var selectedGame = getParameterByName("game",window.location,"zelda3");

// Post effective version of the included logic
var effectiveVersion = "";

var regionObjects = {}; // Collect region objects to call in logic
var regionNames = {};   // Collect region names

// Z3 can use canned breadth logic or graph logic
// var zeldaMode = getParameterByName("zeldaMode",window.location,"oldstyle");
var zeldaMode = getParameterByName("zeldaMode",window.location,"regions");

// FIXME: I don't remember what this does
var metroidMode = getParameterByName("metroidMode",window.location,"");

// TODO: Setup for Z1 Quest ID
var questid = getParameterByName("questid",window.location,1);

// FIXME: Unused?
var authAttempted = false;

// Extend an object
function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function destroyFirebase() {
    // do nothing
}

// Make a nice standardized handle for css classes and object keys
function tokenize(input) {
    let output = input;
    let replacements = {
        ' ': '-',
        '"': '',
        "'": ''
    };
    for(let search in replacements) {
        let replace = replacements[search];
        output = output.replace(search,replace);
    }
    return output.toLowerCase();
}

// Massage token into reasonable title attribute value
function fix_itemlabel(item) {
    var ret = item;
    if(itemNames[ret]) {
        ret = itemNames[ret];
    }

    if((ret.indexOf("boss") === 2) || (ret.indexOf("chest") === 2)) {
        var start = ret.indexOf("boss") === 2 ? 6 : 7;
        if(dungeons[selectedGame][ret.slice(start)]) {
            ret = dungeons[selectedGame][ret.slice(start)].titleStripped;
        }
    }
    if(ret.indexOf("triforcepiece") === 2) {
        ret = "Triforce Piece " + ret.substr(-1);
    }
    ret = ret.ucfirst();
    return ret;
}

// Figure out best image to use
function build_img_url(item,useGame = selectedGame) {
    var misc = [
        "blank",
        "highlighted",
        "poi"
    ];

    // Most are PNGs
    let filext = "png";

    // Not Boss & not Chest
    let itemKey = item;
    let itemKe  = Number.isInteger(parseInt(item.substr(-1))) ? item.substr(0,item.length-1) : item;
    let itemLvl = Number.isInteger(parseInt(item.substr(-1))) ? parseInt(item.substr(-1)) : 0;
    if(
        (item.indexOf("boss") == -1) &&
        (item.indexOf("chest") == -1)
    ) {
        // Check other games
        // FIXME: Get this from Master Manifest
        for(let gameCheck of [
            "metroid3",
            "metroid1",
            "zelda1",
            "zelda3",
            "averge1"
        ]) {
            if(
                gameItems[gameCheck] &&
                (
                    (gameItems[gameCheck].indexOf(itemKey) > -1) ||
                    (gameItems[gameCheck].indexOf(itemKe) > -1)
                )
            ) {
                useGame = gameCheck;
            }
        }
    } else {
        if(itemKey.indexOf("chest") > -1) {
            useGame = "zelda3";
        }
        // Z1Gohma is animated because why not
        if(itemKe == "z1boss5") {
            filext = "gif";
        }
    }

    // Shave off the prefix
    let prefix = manifests[useGame]["prefix"];
    if(item.startsWith(prefix)) {
        item = item.replace(prefix,"");
    }
    if(itemKey.startsWith(prefix)) {
        itemKey = itemKey.replace(prefix,"");
    }
    if(itemKe.startsWith(prefix)) {
        itemKe = itemKe.replace(prefix,"");
    }

    var gReplaceItem = [
        // Bare -> 1
        [
            "agahnim",      // Z3 Lumberjack Tree: Mini
            "bomb",         // Z3Bombs:     Mini
            "bottle",       // Z3Bottle:    Mini
            "flute",        // Z3 Weathervane
            "candle"        // Z1Candle:    Mini
        ],
        // 0 -> 1
        [
            "bomb",         // Z3Bombs:     Off
            "boomerang",    // Z3Boomerang: Off
            "glove",        // Z3Glove:     Off
            "shield",       // Z3Shield:    Off
            "sword",        // Z3Sword:     Off
            "bottle",       // Z1Bottle:    Off
            "candle",       // Z1Candle:    Off
            "ring"          // Z1Ring:      Off
        ],
        // Special cases
        {
            "medallion1":   "bombos", // Z3Bombos:    Mini
            "medallion2":   "ether",  // Z3Ether:     Mini
            "medallion3":   "quake",  // Z3Quake:     Mini
            "pendant0":     "dungeon" + GREENPENDANT,   // Z3 Saha
            "blueCrystal":  "dungeon" + CRYSTAL,    // Blue Crystal
            "redCrystal":   "dungeon" + OJCRYSTAL,  // Red Crystal
            "crystal5":     "dungeon" + OJCRYSTAL,  // Red Crystal
            "crystal6":     "dungeon" + OJCRYSTAL   // Red Crystal
        }
    ];

    // See if we've got a replacement
    if(itemLvl > 0) {
        // console.log(itemKey,itemKe,itemLvl);
    }
    if(gReplaceItem[0].indexOf(itemKey) > -1) {
        // console.log("> Bare -> 1:",itemKey,itemKey+"1");
        item = itemKey + "1";
    } else if(itemLvl == 0 && gReplaceItem[1].indexOf(itemKe) > -1) {
        // console.log("> 0 -> 1:",itemKe+"0",itemKe+"1");
        item = itemKe + "1";
    } else if(gReplaceItem[2][item]) {
        // console.log("> Special:",item,gReplaceItem[2][item]);
        item = gReplaceItem[2][item];
    } else {
        // console.log("NOT FOUND: " + item);
    }

    // Default to inventory
    var category = "inventory";
    // These categories are in these folders
    for([start,cat] of Object.entries({
        "boss":         "bosses",
        "chest":        "chests",
        "medallion":    "medallions",
        "dungeon":      "prizes",
        "pendant":      "prizes"
    })) {
        if(item.startsWith(start)) {
            category = cat;
        }
    }

    // Misc category
    if(misc.indexOf(item) > -1) {
        category = "misc";
    }

    // Start URL
    var url = "images/";
    // Not Misc has a game theme
    if(category != "misc") {
        url += useGame + '/';
    }
    // Build the rest
    url += category + '/' + item + '.' + filext;

    // Print it & ship it!
    return url;
}

function mini(item) {
    // Add the prefix
    let itemKey = item;
    let prefix = manifests[selectedGame]["prefix"];
    if(!itemKey.startsWith(prefix)) {
        itemKey = prefix + item;
    }

    // Make basic title
    var title = item.ucfirst();

    // Try to get title from manifest
    // FIXME: Doesn't work if it's a progressive item
    if(
        manifests[selectedGame] &&
        manifests[selectedGame]["items"] &&
        manifests[selectedGame]["items"][itemKey] &&
        manifests[selectedGame]["items"][itemKey]["name"]
    ) {
        title = manifests[selectedGame]["items"][itemKey]["name"];
    }

    var globalReplaceTitle = {
        pendant1: "Pendant of Power",
        pendant2: "Pendant of Wisdom",
    };
    globalReplaceTitle["dungeon" + GREENPENDANT]    = "Pendant of Courage";
    globalReplaceTitle["dungeon" + CRYSTAL]         = "Blue Crystal";
    globalReplaceTitle["dungeon" + OJCRYSTAL]       = "Red Crystal";

    if(globalReplaceTitle[itemKey]) {
        title = globalReplaceTitle[itemKey].ucfirst();
    }

    for(var i = 0; i < 10; i++) {
        title = title.replace(i,"");
    }
    return '<img src="' + build_img_url(item) + '" title="' + title + '" class="mini" />';
}

function init(callback,arguments) {
    callback(arguments);
}
