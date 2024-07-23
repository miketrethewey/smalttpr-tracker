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

var selectedGameSet = "";
for(let [setID, gameSet] of Object.entries(megaManifest["gameSets"])) {
    if(gameSet["games"].indexOf(selectedGame) > -1) {
        selectedGameSet = setID;
        for(let gameID of gameSet["games"]) {
            scripts.push("script/" + gameID + "/manifest.js");
        }
    }
}
gameSet = selectedGameSet;

scripts.push("script/items.js");
scripts.push("script/shared-access.js");

var sheets = [
];

scripts.push("script/classes/Boss.js");

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

for(var gameName in bossDefns) {
    list = bossDefns[gameName];
    for(var boss in list) {
        boss = list[boss];
        scripts.push("script/classes/Boss/Boss" + boss + ".js");
    }
}

scripts.push("script/classes/Location.js");
scripts.push("script/classes/LocationCollection.js");
scripts.push("script/classes/Region.js");

if(gameSet == "lozmx" || gameSet == "quad") {
    scripts.push("script/classes/Region/TLoZ.js");
    scripts.push("script/classes/Region/Metroid.js");
}
if(gameSet == "smalttpr" || gameSet == "quad") {
    scripts.push("script/classes/Region/ALttP.js");
    scripts.push("script/classes/Region/SuperMetroid.js");
}
if(gameSet == "averge1") {
    scripts.push("script/classes/Region/AxiomVerge.js");
}

// Add Game CSS
let universe = selectedGame.substr(0,selectedGame.length - 1);
sheets.push("css/" + universe + '/' + universe.substr(0,1) + selectedGame.substr(-1) + '/' + universe + selectedGame.substr(-1) + ".css");

// Add NotUniverse CSS
for(let u of ["zelda","metroid"]) {
    if(universe != u) {
        sheets.push(`css/${u}/not${u}.css`);
    }
}
// Add NotCombo CSS
for(let g of ["lozmx","smalttpr"]) {
    if(gameSet != g && gameSet != "quad") {
        sheets.push(`css/gamesets/not${g}.css`)
    }
}

// Add NotGame CSS
for(let g of ["zelda1","metroid1","zelda3","metroid3"]) {
    if(selectedGame != g) {
        let u = g.substring(0,g.length - 1);
        sheets.push(`css/${u}/not${g}.css`)
    }
}

// Add Universe CSS
if(universe == "zelda") {
    sheets.push("css/zelda/zelda.css");
}
if(universe == "metroid") {
    sheets.push("css/metroid/metroid.css");
}

sheets.push("css/portals.css"); // Portals
sheets.push("css/wrapup.css");  // Wrap-Up
scripts.push("script/classes/init.js");

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

                scripts.push(url);
            }
        }
    }
}

scripts.push("script/vue/vue-2.5.16-min.js");
scripts.push("script/main.js");

console.log({sheets:sheets,scripts:scripts});

LazyLoad.css(sheets, function () {
});

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
