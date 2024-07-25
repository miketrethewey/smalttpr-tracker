var cookielock = false;
var cookieDefault = {};
var chestsopenedInit = {};
var chestsimportantInit = {};
var chestsportalInit = {};
var selectedGameSet = "";
var trackerData = {};

for(let [setID, gameSet] of Object.entries(megaManifest["gameSets"])) {
    if(gameSet["games"].indexOf(selectedGame) > -1) {
        selectedGameSet = setID;
    }
    for(let gameID of gameSet["games"]) {
        cookieDefault[gameID]       = {};
        chestsopenedInit[gameID]    = [];
        trackerData[gameID]         = {};
    }
}
var gameSet = selectedGameSet;
var roomid = getParameterByName("roomid",window.location,null);
if(roomid === null) {
    roomid = selectedGameSet;
}

for(var i = 0; i < chests[selectedGame].length; i++) {
    chestsopenedInit[selectedGame].push(false);
    chestsimportantInit[selectedGame].push(false);
    chestsportalInit[selectedGame].push(false);
    var d = document.createElement("div");
    d.innerHTML = chests[selectedGame][i].name;
    var title = d.textContent.trim() || d.innerText.trim() || d.innerHTML.trim();
    if(title.indexOf('(') > -1) {
        title = title.substr(0,title.indexOf('('));
    }
    var remove = ['+','/'];
    for(var search in remove) {
      title = title.replace(remove[search],"");
    }
    chests[selectedGame][i].titleEquipment = chests[selectedGame][i].name;
    chests[selectedGame][i].titleStripped = title.trim();
    chests[selectedGame][i].isSpicy = (selectedGame == "metroid3") && (spicyChests.indexOf(i) > -1);
}
for(var i = 0; i < dungeons[selectedGame].length; i++) {
    var d = document.createElement("div");
    d.innerHTML = dungeons[selectedGame][i].name;
    var title = d.textContent.trim() || d.innerText.trim() || d.innerHTML.trim();
    var remove = ['+','/'];
    for(var search in remove) {
      title = title.replace(remove[search],"");
    }
    dungeons[selectedGame][i].titleEquipment = dungeons[selectedGame][i].name;
    dungeons[selectedGame][i].titleStripped = title.trim();
}

let defaultData = {
    items: itemsInit,
    // chestsimportant: chestsimportantInit[selectedGame],
    chestsopened: chestsopenedInit[selectedGame],
    // chestsportal: chestsportalInit[selectedGame],
    dungeonchests: [...dungeonchestsInit[selectedGame]],
    dungeonbeaten: dungeonbeatenInit[selectedGame],
    medallions: medallionsInit[selectedGame],
    prizes: prizesInit[selectedGame]
};
// console.log(`Setting ThisGame [${selectedGame}] Default Data to "Cookie" and "RAM"`);
for(let [key,val] of Object.entries(defaultData)) {
    if(cookieDefault[selectedGame][key] === undefined) {
        cookieDefault[selectedGame][key] = val;
    }
    if(trackerData[selectedGame][key] === undefined) {
        trackerData[selectedGame][key] = val;
    }
}

// FIXME: Hack
let defaultOptions = {
    zelda3: {
        mapLogic: (zeldaMode == "regions") ? "minorGlitches" : "glitchless"
    },
    averge1: {
        mapLogic:   "glitchless",
        mPos:       "Above",
        mZoom:      100
    }
};
// console.log(`Hacking Z3 and AVerge1 Settings into "Cookie" and "RAM"`);
// console.log(`Adding Settings from ${selectedGame} Manifest into "Cookie" and "RAM"`);
for(let gameName of megaManifest["gameSets"][gameSet]["games"]) {
    if(!(gameName in defaultOptions)) {
        defaultOptions[gameName] = [];
    }
    defaultOptions[gameName] = extend(
        defaultOptions[gameName],
        manifests[gameName]["defaultSettings"]
    );
    cookieDefault[gameName].items = defaultItemGrid[gameName];
    for(let k in defaultOptions[gameName]) {
        if(cookieDefault[gameName][k] === undefined) {
            cookieDefault[gameName][k] = defaultOptions[gameName][k];
        }
        if(trackerData[gameName][k] === undefined) {
            trackerData[gameName][k] = defaultOptions[gameName][k];
        }
    }
}

let defaultSettings = {
    gotprizes:  [0,0,0,0],
    editMode:   false,
    selected:   {}
};
for(let [key,sData] of Object.entries(cookieKeys)) {
    defaultSettings[key] = sData["default"] !== undefined ? sData["default"] : false;
}
// console.log(`Setting Global Default Settings to "Cookie" and "RAM"`);
for(let [key,val] of Object.entries(defaultSettings)) {
    for(let gameName of megaManifest["gameSets"][gameSet]["games"]) {
        if(cookieDefault[gameName][key] === undefined) {
            cookieDefault[gameName][key] = val;
        }
        if(trackerData[gameName][key] === undefined) {
            trackerData[gameName][key] = val;
        }
    }
}
// console.log(
//     {
//         cookieDefault: cookieDefault[selectedGame],
//         trackerData: trackerData[selectedGame]
//     }
// );

function isCounter(key) {
    let searches = [
        "heart",
        "missile",
        "powerbomb",
        "tank"
    ];
    for(let search in searches) {
        search = searches[search];
        if(key.indexOf(search) > -1) {
            return true;
        }
    }
}
function isAmmo(key) {
      let searches = [
          "missile",
          "powerbomb"
      ];
      for(let search in searches) {
          search = searches[search];
          if(key.indexOf(search) > -1) {
              return true;
          }
      }
}

function setCookie(obj) {
    // console.log("ATTEMPTING TO TOSS COOKIE IN STORAGE");
    try {
        // console.log(obj);
        window.localStorage.setItem(gameSet, JSON.stringify(obj));
    } catch (e) {
        // console.log("FAILED TO TOSS COOKIE IN STORAGE");
        // do nothing
    }
}

function getCookie() {
    var str = null;
    try {
        str = window.localStorage.getItem(gameSet);
    } catch (e) {
        // do nothing
    }
    if(!str) {
        var ret = {};
        for(let gameName of megaManifest["gameSets"][gameSet]["games"]) {
            ret[gameName] = {};
        }
        return ret;
    }
    return JSON.parse(str);
}

function loadCookie() {
    // console.log("ATTEMPTING TO LOAD COOKIE");
    if (cookielock) {
        console.log("COOKIE IS LOCKED");
        return;
    }
    cookielock = true;
    cookieobj = getConfigObjectFromCookie(true);
    setConfigObject(cookieobj);
    cookielock = false;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function setConfigObject(configobj) {
    window.vm.itemRows = configobj[selectedGame].items;

    for(let [eleName, sData] of Object.entries(cookieKeys)) {
        let domName = sData["domName"];
        cookieKey = sData["cookieKey"];
        if(!(cookieKey in configobj[selectedGame])) {
            // console.log("NO:",selectedGame,cookieKey);
            continue;
        }
        let eles = document.getElementsByName(domName);
        let eleNum = 0;
        if(eles) {
            // console.log("Have Eles:",eleName);
            let vals = [];
            for(let ele of eles) {
                if(ele.type == "radio") {
                    vals.push(ele.value);
                }
            }
            cookieVal = configobj[selectedGame][cookieKey];
            if(sData["type"] != "calculated") {
                // console.log(`Setting in HTML Form: ${cookieKey} to ${cookieVal}`)
            }
            let test = -1;
            let isRadio = eles.length > 1 || sData["type"] == "option";
            if(vals.indexOf(cookieVal) > -1) {
                test = vals.indexOf(cookieVal);
            }
            if(isRadio && test > -1) {
                eleNum = test;
            }
            if(eles[eleNum]) {
                let ele = eles[eleNum];
                if(isRadio) {
                    // console.log(` > ${domName}`,ele.value);
                    ele.click();
                } else if(sData["type"] == "toggle") {
                    ele.checked = !!configobj[selectedGame][cookieKey];
                    // console.log(` > ${domName}`,ele.checked);
                    ele.onchange();
                } else if(sData["type"] == "value") {
                    ele.value = configobj[selectedGame][cookieKey];
                    ele.onchange();
                }
            }
        }
    }
}

function updateConfigFromFirebase(configobj) {
    console.log("ATTEMPTING TO UPDATE FROM FIREBASE");
    var existingConfig = getConfigObjectFromCookie();
    if(!existingConfig || !existingConfig.ts || existingConfig.ts < configobj.ts) {
        console.log("Overwriting config with Firebase values");
        setConfigObject(configobj);
        saveCookie();
    }
    else {
        console.log("Ignoring Firebase config values due to older timestamp");
    }
}

function saveConfigToFirebase() {
}

function saveCookie(onInit = false) {
    if (cookielock) {
        // console.log("SAVE COOKIE FAILED: LOCKED");
        return;
    }
    cookielock = true;

    if(onInit) {
        console.log("ATTEMPTING TO LOAD INITIAL COOKIE");
        cookieobj = getConfigObjectFromCookie(onInit);
    } else {
        // console.log("ATTEMPTING TO BUILD COOKIE FROM CONFIG OBJ");
        cookieobj = getConfigObject();
        setCookie(cookieobj);
    }

    cookielock = false;
}

function resetCookie() {
    if (cookielock) {
        console.log("RESET COOKIE FAILED: LOCKED");
        return;
    }
    cookielock = true;
    try {
        window.localStorage.removeItem(gameSet);
        window.location.reload();
    } catch(e) {
        // do nothing
    }
    cookielock = false;
}

function getConfigObjectFromCookie(getAllKeys = true) {
    configobj = getCookie();
    var globalKeys = [
        "ts",
        "gameName",
        "itemValues",
        "chestsImportant",
        "chestsOpened",
        "chestsPortal"
    ];

    for(let [key,keyData] of Object.entries(cookieKeys)) {
        if(keyData["type"] == "calculated" && globalKeys.indexOf(key) > -1) {
            continue;
        }
        for(let gameName of megaManifest["gameSets"][gameSet]["games"]) {
            if(configobj[gameName] && configobj[gameName][key] === undefined) {
                if(globalKeys.indexOf(key) < 0) {
                    if(cookieDefault[gameName][key] !== undefined) {
                        // console.log(`Defaulting: ${gameName}/${key} to ${cookieDefault[gameName][key]}`)
                        configobj[gameName][key] = cookieDefault[gameName][key];
                    }
                } else if (!getAllKeys) {
                    configobj[key] = cookieDefault[key];
                }
            }
        }
    }

    if(getAllKeys) {
        // Add any more fields you need to populate from local storage here.
        extend(trackerData[selectedGame].items, configobj.itemValues);
        extend(trackerData[selectedGame].chestsimportant, configobj[selectedGame].chestsimportant);
        extend(trackerData[selectedGame].chestsopened, configobj[selectedGame].chestsopened);
        extend(trackerData[selectedGame].chestsportal, configobj[selectedGame].chestsportal);
        extend(trackerData[selectedGame].dungeonchests, configobj[selectedGame].dungeonchests);
        extend(trackerData[selectedGame].dungeonbeaten, configobj[selectedGame].dungeonbeaten);
    }

    return configobj;
}

function getConfigObject() {
    configobj.ts = (new Date()).getTime();

    configobj[selectedGame] = {};
    configobj[selectedGame].gameName = selectedGame;

    for(let [cookieKey, sData] of Object.entries(cookieKeys)) {
        let eleName = sData["domName"] ? sData["domName"] : cookieKey;
        if(["toggle","value"].indexOf(sData["type"]) > -1) {
            let eles = document.getElementsByName(eleName);
            if(eles) {
                let ele = eles[0];
                if(ele) {
                    if(sData["type"] == "toggle") {
                        configobj[selectedGame][cookieKey] = document.getElementsByName(eleName)[0].checked;
                    } else if(sData["type"] == "value") {
                        configobj[selectedGame][cookieKey] = document.getElementsByName(eleName)[0].value;
                    }
                }
            }
        } else if(sData["type"] == "option") {
            let eles = document.querySelectorAll("input[name=\"" + eleName + "\"]:checked");
            if(eles) {
                let ele = eles[0];
                if(ele) {
                    configobj[selectedGame][cookieKey] = document.querySelector("input[name=\"" + eleName + "\"]:checked").value;
                }
            }
        }
        // console.log(
        //     sData["type"],
        //     eleName,
        //     sData["type"] != "calculated" ? configobj[selectedGame][cookieKey] : ""
        // );
    }
    // console.log("");

    configobj[selectedGame].items = window.vm.itemRows;
    // console.log(
    //     "GET CONFIG OBJ",
    //     {
    //         configobj: configobj[selectedGame].items,
    //         window: window.vm.itemRows
    //     }
    // );

    configobj.itemValues = trackerData[selectedGame].items;

    let savedProperties = [
        "chestsopened",
        "chestsimportant",
        "chestsportal",
        "dungeonsbeaten",
        "dungeonchests"
    ];

    for(let key in savedProperties) {
        key = savedProperties[key];
        configobj[selectedGame][key] = trackerData[selectedGame][key];
    }

    return configobj;
}

// Event of clicking a chest on the map
function toggleChest(x){
    let newVal = !trackerData[selectedGame].chestsopened[x];
    trackerData[selectedGame].chestsopened[x] = newVal;
    chests[selectedGame][x].isOpened = newVal;
    updateAll();
}

var selectGame = '<span id="selectGame">[ ';

var crumbs = {};
for(let gameID of megaManifest["gameSets"][gameSet]["games"]) {
    let crumb = manifests[gameID]["title"]["crumb"];
    crumbs[crumb] = "?game=" + gameID;
}
for(let gameSetID of Object.keys(megaManifest["gameSets"])) {
    if(gameSetID == "averge1") { continue; }
    if(gameSetID != gameSet) {
        let gameID = megaManifest["gameSets"][gameSetID]["games"][0];
        let crumb = megaManifest["gameSets"][gameSetID]["crumb"];
        crumbs[crumb] = "?game=" + gameID;
    }
}
for(let crumb in crumbs) {
    let title = crumb;
    let url = crumbs[crumb];

    selectGame += '<a href="' + url + '">' + title + '</a>';
    if((["smalttpr","quad"].indexOf(gameSet) > -1) && title == "Hyrule of Legend") {
        selectGame += '<a href="?game=zelda3&zeldaMode=regions">*</a>';
    }

    selectGame += ' | ';
}
selectGame += '<a href="faq.html">FAQ</a> | <a href="http://github.com/miketrethewey/smalttpr-tracker/">GitHub</a>';

selectGame += '</span>';

// Highlights a chest location and shows the name as caption
function highlight(x){
    document.getElementById(x).style.backgroundImage = "url(" + build_img_url("highlighted") + ")";
    document.getElementById("caption").innerHTML = selectGame + ' | ' + chests[selectedGame][x].titleEquipment + ' ]';
}

function unhighlight(x){
    document.getElementById(x).style.backgroundImage = "url(" + build_img_url("poi") + ")";
//    document.getElementById("caption").innerHTML = selectGame;
}

function chestClass(x) {
    let ele = document.getElementById(x);
    let chest = chests[selectedGame][x];
    let className = "";
    let availability = "";

    switch(trackerData[selectedGame].mapLogic) {
        case "glitchless":
            availability = chest.isAvailable().glitchless;
            break;
        case "minorGlitches":
            availability = chest.isAvailable().minorGlitches;
            break;
        case "owGlitches":
            availability = chest.isAvailable().owGlitches;
            break;
        case "majorGlitches":
            availability = chest.isAvailable().majorGlitches;
            break;
        case "casualLogic":
            availability = chest.isAvailable().casualLogic;
            break;
        case "tourneyLogic":
            availability = chest.isAvailable().tourneyLogic;
            break;
    }

    // Base classes for a chest
    let classNames = ["mapspan","chest"];
    for(let add in classNames) {
        className += classNames[add] + " ";
    }
    if(chest.type) {
        className += chest.type + " ";
    }
    if(chest.isImportant) {
        className += "important ";
    }
    if(chest.isOpened || (chest.name == "Weathervane" && has("flute",2))) {
        className += "opened ";
    }
    if(chest.isWarp) {
        // className += "portal ";
        // className += "portal-" + selectedGame + " ";
        className += "warp ";
        className += "warp-" + selectedGame + " ";
        if(!document.getElementById("showwarp").checked) {
            className += "hidden ";
        }
    } else if(chest.isPortal) {
        className += "portal ";
        className += "portal-" + manifests[selectedGame]["altGame"][0] + " ";
        if(!document.getElementById("showportal").checked) {
            className += "hidden ";
        }
    }

    className += availability;
    return className;
}

function toggleImportant(x) {
    var ele = document.getElementById(x);
    var chest = chests[selectedGame][x];
    let makeImportant = !chest.isImportant;
    let className = "important";

    chest.isImportant = makeImportant;

    if(makeImportant) {
        ele.classList.add(className);
    } else {
        ele.classList.remove(className);
    }
    trackerData[selectedGame].chestsimportant[x] = makeImportant;

    saveCookie();
}

function togglePortal(x) {
    var ele = document.getElementById(x);
    var chest = chests[selectedGame][x];
    let makePortal = !chest.isPortal;
    let className = "portal-";
    className += manifests[selectedGame]["altGame"][0];

    chest.isPortal = makePortal;

    let classNames = [
        "mapspan",
        "chest",
        "portal",
        "active"
    ];
    if(makePortal) {
        ele.className = "";
        for(let add in classNames) {
            ele.classList.add(classNames[add]);
        }
        ele.classList.add(className);
    } else {
        let add = "";
        ele.classList.remove("portal");
        ele.classList.remove(className);
        ele.classList.remove("active");
        ele.className = ele.className.trim();

        switch(trackerData[selectedGame].mapLogic) {
            case "glitchless":
                add = chest.isAvailable().glitchless;
                break;
            case "minorGlitches":
                add = chest.isAvailable().minorGlitches;
                break;
            case "owGlitches":
                add = chest.isAvailable().owGlitches;
                break;
            case "majorGlitches":
                add = chest.isAvailable().majorGlitches;
                break;
            case "casualLogic":
                add = chest.isAvailable().casualLogic;
                break;
            case "tourneyLogic":
                add = chest.isAvailable().tourneyLogic;
                break;
        }

        if(add != "") {
            add = add.trim();
            ele.classList.add(add);
        }

        if(chest.isImportant) {
            ele.classList.add("important");
        }

        if(chest.isOpened) {
            ele.classList.add("opened");
        }
    }

    trackerData[selectedGame].chestsportal[x] = makePortal;

    saveCookie();
}

// Highlights a chest location and shows the name as caption (but for dungeons)
function highlightDungeon(x){
    document.getElementById("dungeon"+x).style.backgroundImage = "url(" + build_img_url("highlighted") + ")";
    document.getElementById("caption").innerHTML = selectGame + ' | ' + dungeons[selectedGame][x].titleEquipment + ' ]';
}

function unhighlightDungeon(x){
    document.getElementById("dungeon"+x).style.backgroundImage = "url(" + build_img_url("poi") + ")";
//    document.getElementById("caption").innerHTML = selectGame;
}

var wikiRoomNames = {
     0: "Crateria Power Bomb Room",
     1: "The Final Missile",
     2: "Pit Room",
     3: "Crateria Super Room",
     4: "Bomb Torizo Room",
     5: "West Ocean",
     6: "West Ocean",
     7: "West Ocean",
     8: "The Moat",
     9: "Terminator Room",
    10: "Gauntlet Energy Tank Room",
    11: "Green Pirates Shaft",
    12: "Green Pirates Shaft",
    13: "Morph Ball Room",
    14: "Morph Ball Room",
    15: "Blue Brinstar Energy Tank Room",
    16: "Blue Brinstar Energy Tank Room",
    17: "First Missile Room",
    18: "Billy Mays Room",
    19: "Billy Mays Room",
    20: "Green Brinstar Main Shaft",
    21: "Early Supers Room",
    22: "Early Supers Room",
    23: "Brinstar Reserve Tank Room",
    24: "Brinstar Reserve Tank Room",
    25: "Brinstar Reserve Tank Room",
    26: "Etecoon Energy Tank Room",
    27: "Etecoon Super Room",
    28: "Spore Spawn Super Room",
    29: "Big Pink",
    30: "Big Pink",
    31: "Big Pink",
    32: "Pink Brinstar Power Bomb Room",
    33: "Green Hill Zone",
    34: "Waterway Energy Tank Room",
    35: "Hopper Energy Tank Room",
    36: "X-Ray Scope Room",
    37: "Beta Power Bomb Room",
    38: "Alpha Power Bomb Room",
    39: "Alpha Power Bomb Room",
    40: "Spazer Room",
    41: "Warehouse Energy Tank Room",
    42: "Varia Suit Room",
    43: "Warehouse Keyhunter Room",
    44: "Crocomire's Room",
    45: "Crocomire Escape",
    46: "Post Crocomire Power Bomb Room",
    47: "Post Crocomire Missile Room",
    48: "Post Crocomire Jump Room",
    49: "Grapple Beam Room",
    50: "Cathedral",
    51: "Norfair Reserve Tank Room",
    52: "Norfair Reserve Tank Room",
    53: "Green Bubbles Missile Room",
    54: "Bubble Mountain",
    55: "Speed Booster Hall",
    56: "Speed Booster Room",
    57: "Double Chamber",
    58: "Wave Beam Room",
    59: "Ice Beam Room",
    60: "Crumble Shaft",
    61: "Hi Jump Boots Room",
    62: "Hi Jump Energy Tank Room",
    63: "Hi Jump Energy Tank Room",
    64: "Wrecked Ship Main Shaft",
    65: "Bowling Alley",
    66: "Bowling Alley",
    67: "Wrecked Ship East Missile Room",
    68: "Wrecked Ship Energy Tank Room",
    69: "Wrecked Ship West Super Room",
    70: "Wrecked Ship East Super Room",
    71: "Gravity Suit Room",
    72: "Watering Hole",
    73: "Watering Hole",
    74: "Pseudo Plasma Spark Room",
    75: "Plasma Room",
    76: "West Sand Hole",
    77: "West Sand Hole",
    78: "East Sand Hole",
    79: "East Sand Hole",
    80: "Aqueduct",
    81: "Aqueduct",
    82: "Spring Ball Room",
    83: "The Precious Room",
    84: "Botwoon Energy Tank Room",
    85: "Space Jump Room",
    86: "Main Street",
    87: "Main Street",
    88: "Mama Turtle Room",
    89: "Mama Turtle Room",
    90: "Golden Torizo's Room",
    91: "Golden Torizo's Room",
    92: "Screw Attack Room",
    93: "Mickey Mouse Room",
    94: "Lower Norfair Spring Ball Maze Room",
    95: "Lower Norfair Escape Power Bomb Room",
    96: "Wasteland",
    97: "Three Musketeers' Room",
    98: "Ridley Tank Room",
    99: "Lower Norfair Fireflea Room",
};

function clickChest(e) {
    var x = e.target.id;
    switch(e.which) {
        // LEFT
        case 1:
            if(e.ctrlKey) {
                toggleImportant(x);
            } else if(e.shiftKey) {
                togglePortal(x);
            } else {
                toggleChest(x);
            }
            break;

        // MIDDLE
        case 2:
            e.preventDefault();
            if(selectedGame == "metroid3" && wikiRoomNames[x]) {
                window.open("http://wiki.supermetroid.run/" + wikiRoomNames[x]);
                break;
            } else {
                console.log(x);
                break;
            }

        // RIGHT
        case 3:
            // do nothing
            break;

        // DUNNO
        default:
            // do nothing
            break;
    }
}

function showChest(sender) {
    if(["zelda1","zelda3"].indexOf(selectedGame) == -1) { return; }

    trackerData[selectedGame].showChests = sender.checked;
    refreshMap();
    saveCookie();
}

function showCrystal(sender) {
    if([
        "zelda1",
        "zelda3",
        "metroid1",
        "metroid3"
    ].indexOf(selectedGame) == -1) { return; }

    trackerData[selectedGame].showPrizes = sender.checked;
    refreshMap();
    saveCookie();
}

function showMedallion(sender) {
    if(selectedGame != "zelda3") { return; }

    trackerData[selectedGame].showMedals = sender.checked;
    refreshMap();
    saveCookie();
}

function showLabel(sender) {
    trackerData[selectedGame].showLabels = sender.checked;
    refreshMap();
    saveCookie();
}

function showRegions(sender) {
    if(gameSet != "smalttpr" && gameSet != "quad") { return; }

    trackerData[selectedGame].showRegions = sender.checked;
    if(sender.checked) {
        document.getElementById("mapoverlay").classList.remove("off");
        document.getElementById("mapoverlay").classList.add("on");
    } else {
        document.getElementById("mapoverlay").classList.remove("on");
        document.getElementById("mapoverlay").classList.add("off");
    }
    refreshMap();
    saveCookie();
}

function showWarps(sender) {
    if(selectedGame != "zelda3") { return; }

    trackerData[selectedGame].showWarps = sender.checked;
    let eles = document.querySelectorAll(".warp-" + selectedGame);
    if(sender.checked) {
        eles.forEach(function(userItem) {
            userItem.classList.remove("hidden");
        });
    } else {
        eles.forEach(function(userItem) {
            userItem.classList.add("hidden");
        });
    }
    refreshMap();
    saveCookie();
}

function showPortals(sender) {
    trackerData[selectedGame].showPortals = sender.checked;
    let portals = document.querySelectorAll(".portal");
    if(sender.checked) {
        // console.log("Showing Portals");
        portals.forEach(function(userItem) {
            userItem.classList.remove("hidden");
        });
    } else {
        // console.log("Hiding Portals");
        portals.forEach(function(userItem) {
            userItem.classList.add("hidden");
        });
    }

    let altGames = megaManifest["gameSets"][selectedGameSet]["games"];
    for(let altGame of altGames) {
        if(altGame == selectedGame) { continue; }
        let items = document.querySelectorAll(".item-" + altGame);
        if(sender.checked) {
            // console.log(`Showing ${altGame} Items`);
            items.forEach(function(userItem) {
                // console.log(`Showing ${userItem.title}`);
                userItem.classList.remove("hidden");
            });
        } else {
            // console.log(`Hiding ${altGame} Items`);
            items.forEach(function(userItem) {
                // console.log(`Hiding ${userItem.title}`);
                userItem.classList.add("hidden");
            });
        }
    }
    refreshMap();
    saveCookie();
}

function setOrder(mode) {
    if (mode == 1) { // Below
        document.getElementById('layoutdiv').classList.remove('flexcontainer');
        document.getElementById('layoutdiv').classList.remove('flexreverse');
    } else if (mode == 2) { // Side
        document.getElementById('layoutdiv').classList.add('flexcontainer');
        document.getElementById('layoutdiv').classList.remove('flexreverse');
    } else if (mode == 0) { // Above
        document.getElementById('layoutdiv').classList.add('flexcontainer');
        document.getElementById('layoutdiv').classList.add('flexreverse');
    }
    saveCookie();
}

function setZoom(target, sender) {
    document.getElementById(target).style.transform = "scale(" + sender.value / 100 + ")";

    document.getElementById(target + 'size').innerHTML = (sender.value) + '%';
    var offset = -442 * (100 - sender.value) / 100.0;
    if(selectedGame == "metroid3") {
        offset = 0;
        if(target == "mapdiv" && metroidMode == "accessibility") {
            document.getElementById("itemdiv").style.top = 660 * sender.value / 100;
            setZoom("itemdiv",{value:Math.round(sender.value * 1.08)});
        }
    }
    document.getElementById("caption").style.top = offset;
    saveCookie();
}

var prevH = false;
function setMapOrientation(H) {
    if(selectedGame != "zelda3") { return; }

    if (H === prevH) {
        return;
    }
    prevH = H;


    var chest = document.getElementsByClassName("mapspan");
    var i;

    if (H) {
        document.getElementById("mapdiv").classList.remove('mapdiv');
        document.getElementById("mapdiv").classList.add('mapvdiv');
        for (i = 0; i < chest.length; i++) {
            var x = parseFloat(chest[i].style.left) / 100;
            var y = parseFloat(chest[i].style.top) / 100;

            if (x > 0.5) {
                chest[i].style.left = (((x - 0.5) * 2) * 100) + '%';
                chest[i].style.top = (((y / 2) + 0.5) * 100) + '%';
            }
            else {
                chest[i].style.left = ((x  * 2) * 100) + '%';
                chest[i].style.top = ((y / 2) * 100) + '%';
            }
        }
    }
    else {
        document.getElementById("mapdiv").classList.add('mapdiv');
        document.getElementById("mapdiv").classList.remove('mapvdiv');
        for (i = 0; i < chest.length; i++) {
            var x = parseFloat(chest[i].style.left) / 100;
            var y = parseFloat(chest[i].style.top) / 100;

            if (y > 0.5) {
                chest[i].style.left = (((x / 2) + 0.5) * 100) + '%';
                chest[i].style.top = (((y - 0.5) * 2) * 100) + '%';
            }
            else {
                chest[i].style.left = ((x / 2) * 100) + '%';
                chest[i].style.top = ((y * 2) * 100) + '%';
            }
        }
    }
    saveCookie();
}

function setQuest(sender) {
    if(selectedGame != "zelda1") { return; }

    trackerData["zelda1"].mapQuest = 0;

    refreshMap();
    saveCookie();
}

function setOHKO(sender) {
    if(selectedGame != "zelda3") { return; }

    trackerData["zelda3"].mapOHKO = !sender.checked;

    refreshMap();
    saveCookie();
}

function setSwords(sender) {
    if(selectedGame != "zelda3") { return; }

    trackerData[selectedGame].mapSwords = !sender.checked;

    refreshMap();
    saveCookie();
}

function setState(state) {
    if(selectedGame != "zelda3") { return; }

    if(state == "inverted") {
        document.body.classList.add("inverted");
        let ele = document.querySelector(".tunic");
        if(ele) {
            ele.classList.add("inverted");
        }
    } else {
        document.body.classList.remove("inverted");
        let ele = document.querySelector(".tunic.inverted");
        if(ele) {
            ele.classList.remove("inverted");
        }
    }

    trackerData[selectedGame].mapState = state;
    refreshMap();
    saveCookie();
}

function setLogic(logic) {
    trackerData[selectedGame].mapLogic = logic;
    refreshMap();
    saveCookie();
}

function setSMChestSkin(skin) {
    document.getElementById("mapdiv").className = ("mapdiv " + skin);
    document.getElementById("legend").className = ("legend " + skin);

    saveCookie();
}

function showNonVanilla(sender) {
    trackerData[selectedGame].nonVanilla = sender.checked;

    refreshMap();
    saveCookie();
}

function showSettings(sender) {
    if (trackerData[selectedGame].editMode) {
        // trackerData[selectedGame].showChests = document.getElementsByName('showchest')[0].checked;
        // trackerData[selectedGame].showPrizes = document.getElementsByName('showcrystal')[0].checked;
        // trackerData[selectedGame].showMedals = document.getElementsByName('showmedallion')[0].checked;
        // trackerData[selectedGame].showLabels = document.getElementsByName('showlabel')[0].checked;
        trackerData[selectedGame].editMode = false;
        showTracker('mapdiv', document.getElementsByName('showmap')[0]);
        document.getElementById('itemconfig').style.display = 'none';

        sender.innerHTML = '&#128295;';
        saveCookie();
    } else {
        var x = document.getElementById("settings");
        if (!x.style.display || x.style.display === 'none') {
            x.style.display = 'initial';
            sender.innerHTML = 'X';
        } else {
            x.style.display = 'none';
            sender.innerHTML = '&#128295;';
        }
    }
}

function showTracker(target, sender) {
    if (sender.checked) {
        document.getElementById(target).style.display = '';
    }
    else {
        document.getElementById(target).style.display = 'none';
    }
}

function EditMode() {
    // trackerData[selectedGame].showChests = false;
    // trackerData[selectedGame].showPrizes = false;
    // trackerData[selectedGame].showMedals = false;
    // trackerData[selectedGame].showLabels = false;
    trackerData[selectedGame].editMode = true;
    showTracker('mapdiv', {checked:false});
    document.getElementById('settings').style.display = 'none';
    document.getElementById('itemconfig').style.display = '';

    document.getElementById('settingsbutton').innerHTML = 'Exit Edit Mode';
}

function refreshMapMedallions() {
  if(selectedGame != "zelda3") { return; }

  refreshMapMedallion(8);
  refreshMapMedallion(9);
}

function refreshMapMedallion(d) {
    if(selectedGame != "zelda3") { return; }

    // Update availability of dungeon boss AND chests
    if(dungeons[selectedGame][d]) {
        let dung = (document.getElementById("bossMap"+d));
        if(dung) {
            if(trackerData[selectedGame].dungeonbeaten[d]) {
                document.getElementById("bossMap"+d).className = "mapspan boss opened";
            } else {
                document.getElementById("bossMap"+d).className = "mapspan boss " + dungeons[selectedGame][d].isBeatable().getClassName();
            }
            if(trackerData[selectedGame].dungeonchests[d] > 0) {
                document.getElementById("dungeon"+d).className = "mapspan 1dungeon " + dungeons[selectedGame][d].canGetChest().getClassName();
            }
        } else {
            console.log(`Dungeon Map Location not found! '${selectedGame}:${d}'`);
        }

        // TRock medallion affects Mimic Cave
        if(d === 9 && !has("state.inverted")){
            refreshChests();
        }
        // Change the mouseover text on the map
        var dungeonName;
        if(d === 8) {
            dungeonName = "Misery Mire";
        } else {
            dungeonName = "Turtle Rock";
        }
        dungeons[selectedGame][d].name = dungeonName + " " + mini("medallion" + trackerData[selectedGame].medallions[d]) + mini("lantern");
    } else {
        console.log(`Dungeon data not found! '${selectedGame}:${d}'`);
    }
}

function refreshChests() {
    for(k=0; k<chests[selectedGame].length; k++){
        if(chests[selectedGame][k].isOpened != trackerData[selectedGame].chestsopened[k]) {
            chests[selectedGame][k].isOpened = trackerData[selectedGame].chestsopened[k];
        }
        let chest = chests[selectedGame][k];
        let chestDOM = document.getElementById(k);
        if(chestDOM) {
            chestDOM.className = chestClass(k);
            if(gameSet == "smalttpr" || gameSet == "quad") {
                // Determine Lonk's Hoose
                if(chest.name == "Link's House") {
                    if(has("state.inverted")) {            // Inverted, move to Dark World
                        chestDOM.classList.add("bombshop");
                        chestDOM.classList.remove("lonkshoose");
                    } else if(! has("state.inverted")) {    // Not Inverted, move to Light World
                        chestDOM.classList.remove("bombshop");
                        chestDOM.classList.add("lonkshoose");
                    }
                    if(!chest.opened) {
                        chestDOM.classList.remove("unavailable");
                        chestDOM.classList.add("available");
                    }
                // Determine Bomb Shop
                } else if(chest.name == "Bomb Shop") {
                    if(has("state.inverted")) {            // Inverted, move to Light World
                        chestDOM.classList.remove("bombshop");
                        chestDOM.classList.add("lonkshoose");
                    } else if(! has("state.inverted")) {    // Not Inverted, move to Dark World
                        chestDOM.classList.add("bombshop");
                        chestDOM.classList.remove("lonkshoose");
                    }
                // Determine Dark Castle Gate
                } else if(chest.name == "Castle Gate (Dark)") {
                    chestDOM.classList.add("darkgate");
                }
            }
        }
    }
}

function refreshMap() {
  refreshMapMedallions();
  refreshChests();

  for(k=0; k<dungeons[selectedGame].length; k++){
      if(!document.getElementById("bossMap"+k)) { console.log(`Dungeon '${k}' not found!`); continue; }
      if(!trackerData[selectedGame].dungeonbeaten) { console.log(`Beaten Dungeon data not found!`); break; }
      if(trackerData[selectedGame].dungeonbeaten[k]) {
          document.getElementById("bossMap"+k).className = "mapspan boss opened";
      } else {
          document.getElementById("bossMap"+k).className = "mapspan boss " + dungeons[selectedGame][k].isBeatable().getClassName();
      }

      if(!dungeons[selectedGame]) { console.log(`Dungeons not found for '${selectedGame}'!`); }
      if(!dungeons[selectedGame][k]) { console.log(`Dungeon Chests not found for '${selectedGame}[${k}]'!`); }
      if(!trackerData[selectedGame].dungeonchests) { console.log(`Saved Dungeon Chests not found for '${selectedGame}[${k}]'!`); return; }
      if(trackerData[selectedGame].dungeonchests[k]) {
          document.getElementById("dungeon"+k).className = "mapspan dungeon " + dungeons[selectedGame][k].canGetChest().getClassName();
      } else {
          document.getElementById("dungeon"+k).className = "mapspan dungeon opened";
      }

      // Determine Ganon's Tower
      if(dungeons[selectedGame][k].name.indexOf("Ganon's Tower") > -1) {
          if(has("state.inverted")) {            // Inverted, move to Light World
              document.getElementById("bossMap"+k).classList.remove("gt");
              document.getElementById("bossMap"+k).classList.add("at");

              document.getElementById("dungeon"+k).classList.remove("gt");
              document.getElementById("dungeon"+k).classList.add("at");

          } else if(!has("state.inverted")) {    // Not Inverted, move to Dark World
              document.getElementById("bossMap"+k).classList.add("gt");
              document.getElementById("bossMap"+k).classList.remove("at");

              document.getElementById("dungeon"+k).classList.add("gt");
              document.getElementById("dungeon"+k).classList.remove("at");
          }
      // Determine Hyrule Castle Tower
      } else if(dungeons[selectedGame][k].name.indexOf("Castle Tower") > -1) {
          if(has("state.inverted")) {            // Inverted, move to Light World
              document.getElementById("bossMap"+k).classList.remove("at");
              document.getElementById("bossMap"+k).classList.add("gt");

              document.getElementById("dungeon"+k).classList.remove("at");
              document.getElementById("dungeon"+k).classList.add("gt");

          } else if(!has("state.inverted")) {    // Not Inverted, move to Dark World
              document.getElementById("bossMap"+k).classList.add("at");
              document.getElementById("bossMap"+k).classList.remove("gt");

              document.getElementById("dungeon"+k).classList.add("at");
              document.getElementById("dungeon"+k).classList.remove("gt");
          }
      }
  }
}

function itemConfigClick (sender) {
    var item = sender.id;

    if (trackerData[selectedGame].selected.item) {
        document.getElementById(trackerData[selectedGame].selected.item).style.border = '0px';
        sender.style.border = '3px solid yellow';
        trackerData[selectedGame].selected = {item:item};
    } else if (trackerData[selectedGame].selected.row !== undefined) {
        itemGrid[selected.row][selected.col]['item'].style.border = '1px solid white';
        var old = itemLayout[selected.row][selected.col];

        if (old === item) {
            selected = {};
            return;
        }

        if (item !== 'blank') {
            sender.style.opacity = 0.25;

            var r,c;
            var found = false;
            for (r = 0; r < 8; r++) {
                for (c = 0; c < 7; c++) {
                    if (itemLayout[r][c] === item) {
                        itemLayout[r][c] = 'blank';
                        updateGridItem(r, c);
                        found = true;
                        break;
                    }
                }

                if (found)
                    break;
            }
        }

        itemLayout[selected.row][selected.col] = item;
        updateGridItem(selected.row, selected.col);

        document.getElementById(old).style.opacity = 1;

        trackerData[selectedGame].selected = {};
    } else {
        sender.style.border = '3px solid yellow';
        trackerData[selectedGame].selected = {item:item}
    }
}

function populateMapdiv(useGame = "zelda3") {
    var mapdiv = document.getElementById('mapdiv');

    // Initialize all chests on the map
    for(k=0; k<chests[useGame].length; k++){
        var s = document.createElement('span');
        s.style.backgroundImage = 'url(' + build_img_url("poi") + ')';
        s.style.color = 'black';
        s.id = k;
        var d = document.createElement('div');
        if(chests[useGame][k]) {
          s.title = chests[useGame][k].titleStripped + ((useGame == "metroid3" && (typeof wikiRoomNames[k] != "undefined")) ? "\n" + '"' + wikiRoomNames[k] + '"' : "");
          s.onmousedown = function(e) { clickChest(e); };
          s.onmouseover = new Function('highlight('+k+')');
          s.onmouseout = new Function('unhighlight('+k+')');
          s.style.left = chests[useGame][k].x;
          s.style.top = chests[useGame][k].y;
        } else {
          console.log("Can't find Chest #" + k);
        }
        if(trackerData[useGame] && trackerData[useGame].chestsopened[k])
            s.className = "mapspan chest opened";
        else
            s.className = "mapspan chest " + chests[useGame][k].isAvailable().getClassName();
        if(chests[useGame][k].x == "" && chests[useGame][k].y == "") {
            s.style.display = "none";
        }
        if(mapdiv) {
            mapdiv.appendChild(s);
        }
    }

    // Dungeon bosses & chests
    for(k=0; k<dungeons[useGame].length; k++){
        var s = document.createElement('span');
        let bossKey = manifests[useGame]["prefix"] + "boss" + k;
        s.style.backgroundImage = 'url(' + build_img_url(bossKey + itemsMax[bossKey]) + ')';
        s.id = 'bossMap' + k;
        s.title = dungeons[useGame][k].titleStripped;
        s.onmouseover = new Function('highlightDungeon('+k+')');
        s.onmouseout = new Function('unhighlightDungeon('+k+')');
        s.style.left = dungeons[useGame][k].x;
        s.style.top = dungeons[useGame][k].y;
        s.className = "mapspan boss " + dungeons[useGame][k].isBeatable().getClassName();
        if(dungeons[useGame][k].x == "" && dungeons[useGame][k].y == "") {
            s.style.display = "none";
        }
        if(mapdiv) {
            mapdiv.appendChild(s);
        }

        s = document.createElement('span');
        s.style.backgroundImage = 'url(' + build_img_url("poi") + ')';
        s.id = 'dungeon' + k;
        s.title = dungeons[useGame][k].titleStripped;
        s.onmouseover = new Function('highlightDungeon('+k+')');
        s.onmouseout = new Function('unhighlightDungeon('+k+')');
        s.style.left = dungeons[useGame][k].x;
        s.style.top = dungeons[useGame][k].y;
        s.className = "mapspan dungeon " + dungeons[useGame][k].canGetChest().getClassName();
        if(dungeons[useGame][k].x == "" && dungeons[useGame][k].y == "") {
            s.style.display = "none";
        }
        if(mapdiv) {
            mapdiv.appendChild(s);
        }
    }
}

function populateItemconfig() {
    var grid = document.getElementById('itemconfig');

    var i = 0;

    var row;

    for (var key in trackerData[selectedGame].items) {
        let thisGame = selectedGame;
        let altGame = manifests[selectedGame]["altGame"][0];
        let useGame = thisGame;

        if(
            (gameItems[thisGame] && gameItems[thisGame].indexOf(key) > -1) ||
            (gameItems[altGame] && gameItems[altGame].indexOf(key) > -1) ||
            (key == "blank")
        ) {
            if (
                (key.indexOf("boss") < 0) &&
                (gameItems[altGame] && gameItems[altGame].indexOf(key) > -1)
            ) {
                useGame = altGame;
            }
            if (i % 10 === 0){
                row = document.createElement('tr');
                if(grid) {
                    grid.appendChild(row);
                }
            }
            i++;

            var rowitem = document.createElement('td');
            rowitem.className = 'corner editcell';
            rowitem.id = key;
            rowitem.title = fix_itemlabel(key);
            rowitem.style.backgroundSize = '100% 100%';
            rowitem.onclick = new Function('itemConfigClick(this)');
            if((typeof trackerData[thisGame].items[key]) === "boolean"){
                rowitem.style.backgroundImage = "url(" + build_img_url(key,useGame) + ")";
            }
            else if(
                key.indexOf('heart') === 2 ||
                key.indexOf('missile') > -1 ||
                key.indexOf('powerbomb') > -1 ||
                key.indexOf('tank') > -1 ||
                key.indexOf('-node') > -1
            ) {
                rowitem.style.backgroundImage = "url(" + build_img_url(key,useGame) + ")";
            }
            else {
                rowitem.style.backgroundImage = "url(" + build_img_url(key + itemsMax[key],useGame) + ")";
            }
            if(key.indexOf("boss") === 2 && dungeons[thisGame][key.substring(4)]){
                rowitem.style.backgroundImage = "url(" + build_img_url(key + itemsMax[key],useGame) + ")";
                let label = dungeons[thisGame][key.substring(4)].label;
                if(label.length >= 4) {
                    label = label.substring(0,1);
                }
                rowitem.innerText = label;
            }
            row.appendChild(rowitem);
        }
    }
}

function enterPasscode() {

}

function createRoom() {
    var editors = {};
    var passcode = document.getElementById('passcodeInput').value;
}

function resetFirebase() {
    trackerData[selectedGame].items = itemsInit[selectedGame];
    trackerData[selectedGame].dungeonchests = dungeonchestsInit[selectedGame];
    trackerData[selectedGame].dungeonbeaten = dungeonbeatenInit[selectedGame];
    trackerData[selectedGame].prizes = prizesInit[selectedGame];
    trackerData[selectedGame].medallions = medallionsInit[selectedGame];
    trackerData[selectedGame].chestsopened = chestsopenedInit[selectedGame];
    updateAll();
}

function useTourneyConfig() {

}


function initTracker() {
    var useGame = arguments[0];
    if(document && document.body) {
        document.body.classList.add(gameSet);
        if(gameSet == "quad") {
            for(let gameID of ["smalttpr","lozmx"]) {
                document.body.classList.add(gameID);
            }
        }
        document.body.classList.add(selectedGame);
        populateMapdiv(useGame);
        populateItemconfig();

        loadCookie();
        updateAll();

        var games = {
            zelda1:     "TLoZ",
            zelda3:     "ALttP",
            metroid1:   "Metroid",
            metroid3:   "Super Metroid",
            averge1:    "Axiom Verge",
        };
        var game = games[selectedGame];
        if(document.title) {
            document.title = game + " Item Tracker";
        }
        if(document.getElementById("settings")) {
            document.getElementById("settings").querySelectorAll("legend")[0].innerText = game + " Settings";
        }
        if(document.getElementById("caption")) {
            document.getElementById("caption").innerHTML = selectGame + ' ]';
        }
    }

    if(selectedGame == "zelda3") {
        let logics = [
            "glitchless",
            "minorGlitches",
            "owGlitches",
            "majorGlitches"
        ];
        if(zeldaMode == "regions") {
            let idToSelect = logics.indexOf("minorGlitches");
            let eles = document.getElementsByName("maplogic");
            if(eles) {
                if(idToSelect < eles.length) {
                    document.getElementsByName("maplogic")[idToSelect].click();
                }
            }
        } else {
            if(trackerData.zelda3.mapLogic == "minorGlitches") {
                let idToSelect = logics.indexOf("glitchless");
                let eles = document.getElementsByName("maplogic");
                if(eles) {
                    document.getElementsByName("maplogic")[idToSelect].click();
                }
            }
            trackerData.zelda3.mapSwords = true;
            trackerData.zelda3.mapOHKO = false;
        }
        saveCookie();
    }
    if(effectiveVersion != "" && document.getElementById("version")) {
        document.getElementById("version").innerHTML = effectiveVersion;
    }

    window.addEventListener('storage', function(event) {
        let newValues = JSON.parse(event.newValue); // Get value from storage
        // Cycle through new itemValues
        // itemName: itemValue
        if(!newValues.itemValues) { return; }
        for(let [itemName,itemValue] of Object.entries(newValues.itemValues)) {
            // Not a Boss or Chest
            if(
                itemName.indexOf("boss") == -1 &&
                itemName.indexOf("chest") == -1
            ) {
                // console.log(`Checking status of: ${itemName}:${itemValue}`)
                // Go through currently-aware games
                for(let [gameName, gameData] of Object.entries(trackerData)) {
                    if(gameData["items"]) {
                        if(itemName in gameData["items"]) {
                            // console.log(`Checking status of: ${gameName}/${itemName}:${itemValue}`)
                            let currentValue = trackerData[gameName]["items"][itemName];
                            if(currentValue != itemValue) {
                                console.log(`Updating ${gameName}/${itemName}:${currentValue} to ${itemValue}`);
                                trackerData[gameName]["items"][itemName] = itemValue;
                                updateCopies(itemName);
                            }
                        }
                    }
                }
            }
        }
    });
}

function updateCopies(incItem, incVal) {
    let copies = {
        m3kraid: {
            copy: [
                { name: "m3boss2", value: [2,1] }
            ]
        },
        m3phantoon: {
            copy: [
                { name: "m3boss4", value: [2,1] }
            ]
        },
        m3draygon: {
            copy: [
                { name: "m3boss6", value: [2,1] }
            ]
        },
        m3ridley: {
            copy: [
                { name: "m3boss8", value: [2,1] }
            ]
        },
        m3boss2: {
            copy: [
                { name: "m3kraid", value: [true,false] }
            ]
        },
        m3boss4: {
            copy: [
                { name: "m3phantoon", value: [true,false] }
            ]
        },
        m3boss6: {
            copy: [
                { name: "m3draygon", value: [true,false] }
            ]
        },
        m3boss8: {
            copy: [
                { name: "m3ridley", value: [true,false] }
            ]
        },
        m1kraidtotem: {
            copy: [
                { name: "m1boss0", value: [2,1] }
            ]
        },
        m1ridleytotem: {
            copy: [
                { name: "m1boss1", value: [2,1] }
            ]
        },
        m1boss0: {
            copy: [
                { name: "m1kraidtotem", value: [true,false] }
            ]
        },
        m1boss1: {
            copy: [
                { name: "m1ridleytotem", value: [true,false] }
            ]
        }
    }
    for(let [itemName, iData] of Object.entries(copies)) {
        if(incItem == itemName && trackerData[selectedGame]["items"][incItem] !== undefined) {
            incVal = incVal === undefined ? trackerData[selectedGame]["items"][incItem] : incVal;
            for(let copy of iData["copy"]) {
                let oldVal = trackerData[selectedGame]["items"][copy["name"]];
                let copyIDX = copies[copy["name"]]["copy"][0]["value"].indexOf(incVal);
                if(copyIDX == -1) {
                    copyIDX = incVal ? 0 : 1;
                }
                let newVal = copy["value"][copyIDX];
                console.log(`Updating Copy ${selectedGame}/${incItem}:${incVal} => ${selectedGame}/${copy['name']}:${newVal}`);
                trackerData[selectedGame]["items"][copy["name"]] = newVal;
            }
        }
    }
}

function updateAll() {
  if(
    trackerData[selectedGame].items &&
    trackerData[selectedGame].dungeonchests &&
    trackerData[selectedGame].chestsopened &&
    true
  ) {
    vm.displayVueMap = true;
    refreshMap();
    saveCookie();
  }
}

function confirmSaveConfigToFirebase() {
    var confirm = window.confirm("Do you want to push your configuration to all other users of your tracker? This will overwrite their settings. (Use this to get a remote browser to match how this browser appears.)");
    if(confirm) {
        saveConfigToFirebase();
    }
}

Vue.component('tracker-table', {
  template: '#tracker-table',
  props: [
    'itemRows',
    'trackerData',
    'trackerData'
  ],
  computed: {
    maxRowLength: function() {
      return !this.itemRows.reduce ? 0 : this.itemRows.map(function(i) {return i.length}).reduce(function(a,b) {
          return Math.max(a, b);
      });
    }
  },
  methods: {
    itemFor: function(itemName) {
      if(!this.trackerData || !this.trackerData.items) {
        return null;
      }
      return this.trackerData[selectedGame].items[itemName];
    },
    addRow: function(e) {
      vm.itemRows.push(['blank']);
    },
    addItem: function(rowIndex) {
      vm.itemRows[rowIndex].push('blank');
    },
    removeItem: function(rowIndex) {
      vm.itemRows[rowIndex].pop();
      if(vm.itemRows[rowIndex].length === 0) {
        vm.itemRows.splice(rowIndex,1);
      }
    }
  }
});

Vue.component('tracker-cell', {
  template: '#tracker-cell',
  props: [
    'itemValue',
    'itemName',
    'columnIndex',
    'rowIndex',
    'trackerData',
    'trackerData'
  ],
  computed: {
    bossNum: function() {
      mBosses = {
        "13": "kraid",
        "14": "phantoon",
        "15": "draygon",
        "16": "ridley"
      };
      if(Object.values(mBosses).indexOf(this.itemName) > -1) {
        return Object.keys(mBosses)[Object.values(mBosses).indexOf(itemName)];
      }
      if(this.itemName.indexOf("boss") === -1) { return null; }
      return this.itemName.substring(6);
    },
    dungeonLabel: function() {
      if(
        this.bossNum &&
        this.trackerData[selectedGame] &&
        this.trackerData[selectedGame].showLabels &&
        dungeons[selectedGame][this.bossNum]
      ) {
        if(selectedGame == "zelda1") {
          return parseInt(this.bossNum) + 1;
        }
        return dungeons[selectedGame][this.bossNum].label;
      }
      return null;
    },
    itemLabel: function() {
        return fix_itemlabel(this.itemName);
    },
    textCounter: function() {
      var itemValue = this.trackerData[selectedGame].items[this.itemName];
      if(
        this.itemName.indexOf('heart') === 2 ||
        this.itemName.indexOf('missile') > -1 ||
        this.itemName.indexOf('powerbomb') > -1 ||
        this.itemName.indexOf('tank') > -1 ||
        this.itemName.indexOf('-node') > -1
        ) {
        if(
            this.itemName.indexOf('missile') > -1 ||
            this.itemName.indexOf('powerbomb') > -1
        ) {
            itemValue *= 5;
        }
        return itemValue;
      }
      return null;
    },
    backgroundImage: function() {
      var itemValue = this.trackerData[selectedGame].items[this.itemName];
      if(this.itemName === 'blank') {
        return this.trackerData[selectedGame].editMode ? 'url(' + build_img_url("blank") + ')' : 'none';
      }
      else if((typeof itemValue) === "boolean") {
        return 'url(' + build_img_url(this.itemName) + ')';
      }
      else if(this.textCounter !== null) {
        return 'url(' + build_img_url(this.itemName) + ')';
      }
      return 'url(' + build_img_url(this.itemName + (this.trackerData[selectedGame].editMode ? itemsMax[this.itemName] : (itemValue || '0'))) + ')';
    },
    isActive: function() {
      var itemValue = this.trackerData[selectedGame].items[this.itemName];
      return this.trackerData[selectedGame].editMode || itemValue;
    },
    isTunic: function() {
      let lowerItemName = this.itemName.toLowerCase();
      return lowerItemName.indexOf("tunic") > -1 || lowerItemName.indexOf("mail") > -1;
    },
    chestImage: function() {
      if(["zelda1","zelda3"].indexOf(selectedGame) == -1) { return null; }

    //   if(this.bossNum) {
    //     console.log(
    //         {
    //             bossNum: this.bossNum,
    //             trackerData: this.trackerData[selectedGame],
    //             dungeonchests: this.trackerData[selectedGame].dungeonchests
    //         }
    //       );
    //   }
      if(
        this.bossNum &&
        this.trackerData[selectedGame] &&
        this.trackerData[selectedGame].showChests
      ) {
        return "url(" + build_img_url("chest" + this.trackerData[selectedGame].dungeonchests[this.bossNum]) + ")";
      }
      return null;
    },
    prizeImage: function() {
      if([null,"10","11","12"].indexOf(this.bossNum) > -1) {
        return null;
      }
      if(
        this.bossNum &&
        this.trackerData[selectedGame] &&
        this.trackerData[selectedGame].showPrizes
      ) {
        return "url(" +
          build_img_url(
            "dungeon" + this.trackerData[selectedGame].prizes[this.bossNum],
            "zelda3"
          ) +
        ")";
      }
      return null;
    },
    medallionImage: function() {
      if(selectedGame != "zelda3") { return null; }
      if((this.bossNum === "8" || this.bossNum === "9") && this.trackerData[selectedGame] && this.trackerData[selectedGame].showMedals) {
        return "url(" + build_img_url("medallion" + this.trackerData[selectedGame].medallions[this.bossNum]) + ")";
      }
      return null;
    },
    itemClass: function() {
      let universe = selectedGame.substr(0,selectedGame.length - 1);
      let itemGame = selectedGame;
      let className = "";

      // FIXME: Use keys from Master Manifest
      for(let checkGame of ["zelda1","zelda3","metroid1","metroid3","averge1"]) {
        if(gameItems[checkGame]) {
            if(gameItems[checkGame].indexOf(this.itemName) > -1) {
            itemGame = checkGame;
          }
        }
      }
      className += this.dungeonLabel ? " dungeonCell" : "";
      className += " item-" + itemGame;

      return className.trim();
    },
    ohkoClass: function() {
      // It's Z3
      // It's a Tunic
      let className = "";
      if(
        this.itemClass.toLowerCase().indexOf("item-zelda3") > -1 &&
        this.itemLabel.toLowerCase().indexOf("tunic") > -1
      ) {
        // OHKO is checked
        if(!this.trackerData[selectedGame].mapOHKO) {
          className += " ohko";
        }
        // Map State is inverted
        if(this.trackerData[selectedGame].mapState == "inverted") {
          className += " inverted";
        }
        return className;
      }
      return null;
    },
    swordlessClass: function() {
      // It's Z3
      // It's a Sword
      // Swordless is checked
      if(
        this.itemClass.toLowerCase().indexOf("item-zelda3") > -1 &&
        this.itemLabel.toLowerCase().indexOf("sword") > -1 &&
        !this.trackerData[selectedGame].mapSwords
      ) {
          return "swordless";
      }
      return null;
    }
  },
  methods: {
    clickCell: function(amt) {
      if((
        trackerData[selectedGame].mapSwords === false) &&
        (this.itemName.indexOf("z3sword") > -1)
      ) {
          return;
      }
      var itemValue = this.trackerData[selectedGame].items[this.itemName];
      if(this.trackerData[selectedGame].editMode) {
          Vue.set(vm.itemRows[this.rowIndex], this.columnIndex, this.trackerData[selectedGame].selected.item || 'blank');
        return;
      }
      // Non-edit mode clicks
      if(this.bossNum) {
        // Do both this and the below for bosses
        this.trackerData[selectedGame].dungeonbeaten[this.bossNum] = !this.trackerData[selectedGame].dungeonbeaten[this.bossNum];
        updateAll();
        updateCopies(manifests[selectedGame]["prefix"] + "boss" + this.bossNum, this.trackerData[selectedGame].dungeonbeaten[this.bossNum]);
      }
      // M1 Bosses
      if([
        //   "m1kraid",
        //   "m1ridley",
        //   "m1kraidtotem",
        //   "m1ridleytotem",
        //   "m1boss0",    // m1kraid
        //   "m1boss1",    // m1ridley
          "m3boss2",    // m3kraid
          "m3boss4",    // m3phantoon
          "m3boss6",    // m3draygon
          "m3boss8",    // m3ridley
          "m3boss9"     // mbm3
      ].indexOf(this.itemName) > -1) {
        console.log(this.itemName);
        let bosses = [];
        let bossIDX = -1;
        let bossName = "";
        if(selectedGame == "metroid1") {
            bosses = ["kraid","ridley","mb"];
        } else if(selectedGame == "metroid3") {
            bosses = [
                "bt",       // 0
                "spospo",   // 1
                "kraid",    // 2
                "croc",     // 3
                "phantoon", // 4
                "botwoon",  // 5
                "draygon",  // 6
                "gt",       // 7
                "ridley",   // 8
                "mb"        // 9
            ];
        }
        for(let [idx,boss] of Object.entries(bosses)) {
            if(this.itemName.indexOf(boss) > -1) {
                bossIDX = idx;
                bossName = boss;
            }
        }
        if(bossIDX == -1) {
            bossIDX = this.itemName.substring(-1);
        }
        this.trackerData[selectedGame].dungeonbeaten[bossIDX] = !this.trackerData[selectedGame].dungeonbeaten[bossIDX];
      }
      if((typeof itemValue) === "boolean"){
        this.trackerData[selectedGame].items[this.itemName] = !itemValue;
        updateCopies(this.itemName,!itemValue);
        updateAll();
      }
      else{
        var newVal = (itemValue || 0) + amt;
        if(newVal > itemsMax[this.itemName]){
          newVal = itemsMin[this.itemName];
        }
        if(newVal < itemsMin[this.itemName]){
          newVal = itemsMax[this.itemName];
        }
        this.trackerData[selectedGame].items[this.itemName] = newVal;
        updateAll();
      }
    },
    clickCellForward: function(e) {
      this.clickCell(1);
    },
    clickCellBack: function(e) {
      this.clickCell(-1);
    },
    clickMedallion: function(amt) {
      var limit = 4;   // Off
                        // Bombos
                        // Ether
                        // Quake
      var newVal = (
        this.trackerData[selectedGame].medallions[this.bossNum] +
        amt +
        limit
      ) %
      limit;
      // need to use splice here instead of just setting it the normal way or vue won't pick up the change
      this.trackerData[selectedGame].medallions.splice(this.bossNum, 1, newVal);
      updateAll();
    },
    clickMedallionForward: function(e) {
      this.clickMedallion(1);
    },
    clickMedallionBack: function(e) {
      this.clickMedallion(-1);
    },
    clickChest: function(amt) {
      var gameAbbr = manifests[selectedGame]["title"]["short"].toLowerCase();
      var chestitem = gameAbbr + 'chest' + this.bossNum;

      var limit = dungeonchestsInit[selectedGame][this.bossNum];
      let newVal = limit;
      if(this.trackerData[selectedGame]["items"][chestitem] !== undefined) {
        newVal = this.trackerData[selectedGame]["items"][chestitem];
      }
      let oldVal = newVal;
      newVal += amt;
      if(newVal < 0 || isNaN(newVal)) {
        newVal = limit;
      }
      if(newVal > limit) {
        newVal = 0;
      }
      console.log(
        {
            bossNum: this.bossNum,
            limit: limit,
            oldVal: oldVal,
            amt: amt,
            newVal: newVal
        }
      );

      this.trackerData[selectedGame]["items"][chestitem] = newVal;
      this.trackerData[selectedGame].dungeonchests.splice(this.bossNum, 1, newVal);
      console.log(
        `Clicked ${chestitem}`,
        newVal
      );
      updateAll();
    },
    clickChestForward: function(e) {
      this.clickChest(1);
    },
    clickChestBack: function(e) {
      this.clickChest(-1);
    },
    clickPrize: function(amt) {
      let limit = 7;   // Blue Crystal
                        // Red Crystal
                        // Off Pendant
                        // Green Pendant
                        // M3
                        // Z1
                        // M1
      var newVal = (
        this.trackerData[selectedGame].prizes[this.bossNum] +
        amt +
        limit
      ) %
      limit;
      // need to use splice here instead of just setting it the normal way or vue won't pick up the change
      this.trackerData[selectedGame].prizes.splice(this.bossNum, 1, newVal);
      updateAll();
    },
    clickPrizeForward: function(e) {
        this.clickPrize(1);
    },
    clickPrizeBack: function(e) {
        this.clickPrize(-1);
    },
  }
});

var vm = new Vue({
  data:{
      itemRows: [],
      trackerData: window.trackerData,
      displayVueMap: false
  },
  el: '#layoutdiv'
});
