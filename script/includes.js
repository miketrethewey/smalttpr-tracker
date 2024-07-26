function fix_region(str) {
    var replace = [
                    "dungeons",
                    "world",
                    "east",
                    "west",
                    "death",
                    "mountain",
                    "palace",
                    "tower",
                    "power",
                    "castle",
                    "escape",
                    "mire",
                    "of",
                    "darkness",
                    "woods",
                    "town",
                    "hera",
                    "rock",

                    "brinstar",
                    "hyrule",
                    "tourian",
                    "norfair",
                    "zebes",
                    "ship",
                    "portals",
                    "warps",

                    "caves",
                    "making",
                    "game",
                    "any",
                    "hint",
    ];
    for(var check in replace) {
        check = replace[check];
        str = str.replace(check,check.ucfirst());
    }
    if(str.toLowerCase().indexOf("crocomire") > -1) {
        str = str.replace("crocoMire","Crocomire");
    }
    if(str.toLowerCase().indexOf("overworld") > -1) {
        str = str.replace("overWorld","Overworld");
    }
    return str.ucfirst();
}

var scripts = [];
var sheets = [];

function addScript(script) {
    if(scripts.indexOf(script) == -1) {
        scripts.push(script);
    }
}
function addSheet(sheet) {
    if(sheets.indexOf(sheet) == -1) {
        sheets.push(sheet);
    }
}
function addAux(filepath) {
    if(filepath.indexOf(".js") > -1) {
        addScript(filepath);
    } else if(filepath.indexOf(".css") > -1) {
        addSheet(filepath);
    }
}

let bossFiles = [];

// FIXME: Find a way to get from manifest
var bossDefns = {
    zelda3: [
        "ArmosKnights",
        "Lanmolas",
        "Moldorm",
        "Agahnim",
        "HelmasaurKing",
        "Arrghus",
        "Mothula",
        "Blind",
        "Kholdstare",
        "Vitreous",
        "Trinexx",
        "Ganon"
    ],
    zelda1: [
        "Aquamentus",
        "Digdogger",
        "Dodongo",
        "Gleeok",
        "Gohma",
        "Manhandla"
    ],
};

// JS: Get manifests for this gameSet
// CSS: Get NotCombo CSS
var selectedGameSet = "";
for(let [setID, gameSet] of Object.entries(megaManifest["gameSets"])) {
    if(gameSet["nyi"]) { continue; }
    if(gameSet["games"].indexOf(selectedGame) > -1) {
        selectedGameSet = setID;
        for(let gameID of gameSet["games"]) {
            addAux("script/" + gameID + "/manifest.js");
            // JS: Get Boss defns
            if(gameID in bossDefns) {
                list = bossDefns[gameID];
                for(var boss in list) {
                    boss = list[boss];
                    bossFiles.push("script/classes/Boss/Boss" + boss + ".js");
                }
            }
        }
    } else {
        addAux("css/gamesets/not" + setID + ".css");
    }
}
gameSet = selectedGameSet;

// JS: Get global items
addAux("script/items.js");
// JS: Get global access
addAux("script/shared-access.js");

// JS: Get Boss prototype
addAux("script/classes/Boss.js");

// JS: Get Boss defns
for(let filename of bossFiles) {
    addAux(filename);
}

// JS: Get Location prototype
addAux("script/classes/Location.js");
addAux("script/classes/LocationCollection.js");
// JS: Get Region prototype
addAux("script/classes/Region.js");

// JS: Get NES Region prototype
if(gameSet == "lozmx" || gameSet == "quad") {
    addAux("script/classes/Region/TLoZ.js");
    addAux("script/classes/Region/Metroid.js");
}
// JS: Get SNES Region prototype
if(gameSet == "smalttpr" || gameSet == "quad") {
    addAux("script/classes/Region/ALttP.js");
    addAux("script/classes/Region/SuperMetroid.js");
}
// JS: Get Averge1 Region prototype
if(gameSet == "averge1") {
    addAux("script/classes/Region/AxiomVerge.js");
}

// CSS: Add Game CSS
let universe = selectedGame.substr(0,selectedGame.length - 1);
addAux("css/" + universe + '/' + universe.substr(0,1) + selectedGame.substr(-1) + '/' + universe + selectedGame.substr(-1) + ".css");

// CSS: Add NotUniverse CSS
for(let u of ["zelda","metroid"]) {
    if(universe != u) {
        addAux(`css/${u}/not${u}.css`);
    }
}

// CSS: Add NotGame CSS
for(let g of ["zelda1","metroid1","zelda3","metroid3"]) {
    if(selectedGame != g) {
        let u = g.substring(0,g.length - 1);
        addAux(`css/${u}/not${g}.css`)
    }
}

// CSS: Add Universe CSS
if(universe == "zelda") {
    addAux("css/zelda/zelda.css");
}
if(universe == "metroid") {
    addAux("css/metroid/metroid.css");
}

addAux("css/portals.css");         // CSS: Portals
addAux("css/wrapup.css");          // CSS: Wrap-Up
addAux("script/classes/init.js"); // JS:  Initialize classes

// FIXME: Find a way to get from manifest
var regionNames = {
    zelda1: {
        overworld: [
            "freehint",
            "item",
            "moneymakinggame",
            "paidhint",
            "potions",
            "road",
            "rupoor",
            "secretcaves",
            "shop",
            "takeany"
        ],
        z1dungeons: [
            "level0",
            "level1",
            "level2",
            "level3",
            "level4",
            "level5",
            "level6",
            "level7",
            "level8",
            "level9"
        ],
    },
    zelda3: {
        dungeons:   ["main"],
        overworld:  ["main"],
        zebes:      ["z3-m3"],
    },
    metroid1: {
        m1brinstar:         ["main"],
        kraid:              ["main"],
        m1norfair:          ["main"],
        ridley:             ["main"],
        m1tourian:          ["main"],
        m1hyruleportals:    ["main"],
    },
    metroid3: {
        crateria:           ["central","east","west"],
        m3brinstar:         ["blue","green","pink","red","kraid"],
        m3norfair:          ["crocomire","east","west"],
        wreckedship:        ["main"],
        maridia:            ["inner","outer"],
        lowernorfair:       ["west","east"],
        m3tourian:          ["main"],
        m3hyruleportals:    ["main"],
    },
    averge1: {
        "absu":     ["main"],
        "edin":     ["main"],
        "eKurMah":  ["main"],
        "eribu":    ["main"],
        "kur":      ["main"],
        "indi":     ["main"],
        "marUru":   ["main"],
        "ukkinNa":  ["main"],
        "zi":       ["main"],
    }
};

if(zeldaMode == "regions") {
    regionNames.zelda3 = {
        hyrulewarps: ["main"],
        z3dungeons: [
            "easternpalace",
            "desertpalace",
            "towerofhera",
            "palaceofdarkness",
            "swamppalace",
            "skullwoods",
            "thievestown",
            "icepalace",
            "miserymire",
            "turtlerock",
            "ganonstower",
            "hyrulecastleescape",
            "hyrulecastletower",
            "pyramidofpower"
        ],
        darkworld: [
            "mire",
            "northeast",
            "northwest",
            "south"
        ],
        darkworlddeathmountain: [
            "east",
            "west"
        ],
        deathmountain: [
            "east",
            "west"
        ],
        lightworld: [
            "northeast",
            "northwest",
            "south"
        ],
        z3zebesportals: ["main"],
    }
}

// JS: Get Region defns
for(var gameName in regionNames) {
    if(gameName == selectedGame) {
        game = regionNames[gameName];
        for(var regionName in game) {
            region = game[regionName];
            for(var segment in region) {
                var segmentName = region[segment];
                var url = "";

                if(!(gameName == "zelda3" && zeldaMode == "oldstyle")) {
                    url += "script/classes/Region/";

                    // FIXME: Find a way to get from manifest
                    let dirs = {
                        zelda3:     "ALttP",
                        metroid3:   "SuperMetroid",
                        zelda1:     "TLoZ",
                        metroid1:   "Metroid",
                        averge1:    "AxiomVerge",
                    };

                    url += dirs[selectedGame] + '/';

                    url += fix_region(regionName) + '/' + fix_region(regionName) + fix_region(segmentName) + ".js";
                } else if(gameName == "zelda3" && zeldaMode == "oldstyle") {
                    url += "script/zelda3/region/" + regionName + '/' + segmentName + ".js";
                }

                addAux(url);
            }
        }
    }
}

// JS : Vue
let vueOptions = {
    "ver":  2,
    "mode": "local",
    "local": {
        "2": "script/vue/2.7.16/vue.min.js",
        "3": "script/vue/3.4.34/vue.global.prod.js"
    },
    "online": {
        "2": "https://unpkg.com/vue@2/dist/vue.min.js",
        "3": "https://unpkg.com/vue@3/dist/vue.global.prod.js"
    }
};
addAux(vueOptions[vueOptions["mode"]][vueOptions["ver"]]);

addAux("script/options.js");              // JS: Switches
addAux("script/main.js");                 // JS: Main App

console.log({sheets:sheets,scripts:scripts});

// CSS: Load
LazyLoad.css(sheets, function () {});

// JS: Load
LazyLoad.js(scripts, function () {
    init(initClasses,selectedGame);
    init(initTracker,selectedGame);
    document.body.classList.add(universe);
    if(selectedGame == "zelda3") {
        document.body.classList.add("zelda3-" + zeldaMode);
    } else if(selectedGame == "metroid3" && metroidMode != "") {
        document.body.classList.add("metroid3-" + metroidMode);
    }
});
