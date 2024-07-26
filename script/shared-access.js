// Availability "class"
function Availability(glitchless = 'unavailable', minorGlitches = 'unavailable', owGlitches = 'unavailable', majorGlitches = 'unavailable') {
    this._glitchless    = glitchless;       // Zelda
    this._casualLogic   = glitchless;       // Metroid

    this._minorGlitches = minorGlitches;    // Zelda

    this._owGlitches    = owGlitches;       // Zelda
    this._tourneyLogic  = owGlitches;       // Metroid

    this._majorGlitches = majorGlitches;    // Zelda

    this.getClassName = function () {
        return this[trackerData[selectedGame].mapLogic];
    }
}

// Metroid: Casual Logic
Object.defineProperty(Availability.prototype, 'casualLogic', {
    get: function () {
        return this._casualLogic;
    },
    set: function (value) {
        this._casualLogic   = value;
        this._tourneyLogic  = value;
    }
});

// Zelda: No Major Glitches
Object.defineProperty(Availability.prototype, 'glitchless', {
    get: function () {
        return this._glitchless;
    },
    set: function (value) {
        this._glitchless    = value;
        this._minorGlitches = value;
        this._owGlitches    = value;
        this._majorGlitches = value;
    }
});

// Zelda: Minor Glitches
Object.defineProperty(Availability.prototype, 'minorGlitches', {
    get: function () {
        return this._minorGlitches;
    },
    set: function (value) {
        this._minorGlitches = value;
        this._owGlitches    = value;
        this._majorGlitches = value;
    }
});

// Zelda: Overworld Glitches
Object.defineProperty(Availability.prototype, 'owGlitches', {
    get: function () {
        return this._owGlitches;
    },
    set: function (value) {
        this._owGlitches    = value;
        this._majorGlitches = value;
    }
});

// Metroid: Tournament Logic
Object.defineProperty(Availability.prototype, 'tourneyLogic', {
    get: function () {
        return this._tourneyLogic;
    },
    set: function (value) {
        this._tourneyLogic = value;
    }
});

// Zelda: Major Glitches
Object.defineProperty(Availability.prototype, 'majorGlitches', {
    get: function () {
        return this._majorGlitches;
    },
    set: function (value) {
        this._majorGlitches = value;
    }
});

// Get how much of an item we've got
function getHas(item) {
    var val = 0;    // Default to 0
    let items = trackerData[selectedGame]["items"];
    // Get all items
    if(items) {
        // If the one we're looking for is here
        if(item in items) {
            // Return the value
            val = items[item];
        }
    }
    return val;
}

// Determine if we've got an item
function has(item, amount = -1) {
    var ret = false;    // Default to not found
    var val = -1;       // Default to nonsense

    var globalReplace = {
        lamp: "lantern",
        pearl: "moonpearl"
    };

    if(item in globalReplace) {
        item = globalReplace[item];
    }

    // Check if we need prefix
    let prefix = "";
    if(manifests[selectedGame]["prefix"]) {
        prefix = manifests[selectedGame]["prefix"];
        if(!item.startsWith(prefix)) {
            item = prefix + item;
        }
    }

    // If there's no dot, we're doing something special
    if(item.indexOf('.') == -1) {
        val = getHas(item); // Get value
        ret = val > 0;      // Check if we've got some

        if(ret) {
            // If it's not the amount we're looking for, false
            if(amount > -1 && val < amount) {
                ret = false;
            }
        }
    }

    // If SMALttPR or Quad and it's not Standard
    if((gameSet == "smalttpr" || gameSet == "quad") && item.indexOf("state") > -1) {
        // Check for Open
        let open = trackerData.zelda3.mapState == "open";
        // Check for Inverted
        let inverted = trackerData.zelda3.mapState == "inverted";
        // If we're checking for Open State, send it
        if(item.indexOf("open") > -1) {
            ret = open;
        }
        // If we're checking for Inverted State, send it
        if(item.indexOf("inverted") > -1) {
            ret = inverted;
        }
    }
    // If we're checking for swords
    if(item.indexOf("swords") > -1) {
        if(
            item.indexOf("swordless") > -1 &&       // If we're checking for Swordless
            trackerData.zelda3.mapSwords == false   // And Swordless is selected
        ) {
            ret = true;
        }
    }
    // If we're checking for a Variation
    if(item.indexOf("variation") > -1) {
        if(
            item.indexOf("ohko") > -1 &&    // If we're checking for OHKO
            trackerData.zelda3.mapOHKO      // And OHKO is set
        ) {
            ret = true;
        }
    }

    // Check for specials
    // Keys, Crystals, Pendants, Medallions
    if(
        item.indexOf("key") > -1 ||        // FIXME: Keys for Dungeons
        item.indexOf("crystal") > -1 ||
        item.indexOf("pendant") > -1 ||
        item.indexOf("medallion") > -1
    ) {
        // Checking for Big Key?
        let checkBK             = item.indexOf("bigkey") > -1;
        // Checking for any Key?
        let checkKey            = item.indexOf("key") > -1;
        // Checking for any Crystal?
        let checkCrystal        = item.indexOf("crystal") > -1;
        // Checking for any Pendant?
        let checkPendant        = item.indexOf("pendant") > -1;
        // Checking for a Prize?
        let checkPrize          = checkCrystal || checkPendant;
        // Checking for a Medallion?
        let checkMedallion      = item.indexOf("medallion") > -1;

        if(checkBK) {   // FIXME: Big Key returns true
            ret = true;
        } else if(checkKey) {   // FIXME: Any Key returns true
            ret = true;
        } else if(checkPrize) { // Checking for Prizes
            countPrizes();
            let prizes = trackerData[selectedGame].gotprizes;
            if(item.indexOf("crystal") > -1) {
                // Checking for Crystals
                if(item.indexOf("all") > -1) {
                    // All Crystals
                    // 5 Blue, 2 Red
                    ret = prizes[CRYSTAL] == 5 && prizes[OJCRYSTAL] == 2;
                } else if(item.indexOf("5") > -1) {
                    // Crystal 5 if at least one Red
                    ret = prizes[OJCRYSTAL] >= 1;
                } else if(item.indexOf("6") > -1) {
                    // Crystal 6 if we've got both Red
                    ret = prizes[OJCRYSTAL] == 2;
                }
            } else if(item.indexOf("pendant") > -1) {
                // Checking for Pendants
                if(item.indexOf("all") > -1) {
                    // All Pendants
                    // 2 Off, 1 Green
                    ret = prizes[OFFPENDANT] == 2 && prizes[GREENPENDANT] == 1;
                } else if(item.indexOf("offs") > -1) {
                    // Offs if we've got both Off
                    ret = prizes[OFFPENDANT] >= 1;
                } else if(item.indexOf("green") > -1) {
                    // Green
                    ret = prizes[GREENPENDANT] == 1;
                }
            }
        } else if(checkMedallion) { // Checking for Entry Medallions
            // Set success to false
            let success = false;
            let dung = "";  // Dungeon Name
            let dungs = [   // Dungeon Names
                "","","","","","","","",
                "mire",
                "trock"
            ];
            let medals = [  // Medallion Names
                "?",
                "bombos",
                "ether",
                "quake"
            ];
            if(item.indexOf("mire") > -1) { // Searching for Mire Entry
                dung = "mire";
            } else if(item.indexOf("trock") > -1) { // Searching for TRock Entry
                dung = "trock";
            }
            if(dung != "") {
                // We figured out the Dungeon we're searching for
                // Figure out the Medallion we need
                let neededMedalID = trackerData[selectedGame]['medallions'][dungs.indexOf(dung)];
                let neededMedal = medals[neededMedalID];
                let haveAllMedals = has("bombos") && has("ether") && has("quake");
                let haveNeededMedal = false;
                if(neededMedalID > 0) {
                    haveNeededMedal = has(neededMedal);
                }
                // Success if we've got the one we're looking for or if we've got all of them
                success = haveNeededMedal || haveAllMedals;
            }
            ret = success;
        }
    }

    return ret;
}

// Helper functions to simplify logic.
// ALttP Ability Functions
function canDash() {
    // Boots
    return has("boots");
}

function canActivateTablets() {
    // Book and at least Sword2
    return has("book") && hasSword(2);
}

function canActivateMedallions() {
    // Have a Sword or Swordless
    return hasSword() || has("swords.swordless");
}

function hasSword(min_level = 1) {
    // Check for Sword minimu level
    // Swordless Hammer counts as Sword2
    switch(min_level) {
        case 4:
            return has("sword",4);
        case 3:
            return has("sword",3);
        case 2:
            return has("sword",2) || (has("swords.swordless") && has("hammer"));
        case 1:
            return has("sword",1);
        default:
            return has("sword") || (has("swords.swordless") && has("hammer"));
    }
}

function canGrapple() {
    // Hookshot
    return has("hookshot");
}

function canInvul() {
    // Cape || Byrna
    return has("cape") || has("byrna");
}

function canRead() {
    // Book
    return has("book");
}

function canSwim() {
    // Flippers
    return has("flippers");
}

function canLiftRocks() {
    // Power Glove
    return has("glove",1);
}

function canLiftDarkRocks() {
    // Titan's Mitt
    return has("glove",2);
}

function canLightTorches() {
    // FRod or Lamp
    return has("firerod") || has("lantern");
}

function canMeltThings() {
    // FRod or can use Bombos
    return has("firerod") || (has("bombos") && canActivateMedallions());
}

function canFly() {
    // Activated Flute
    return has("flute",2);
}

function canSpinSpeed() {
    // Boots and Sword or Hookshot
    return canDash() && (has("sword",1) || canGrapple());
}

function canShootArrows() {
    // Bow
    return has("bow");
}

function canBlockLasers() {
    // Mirror Shield
    return has("shield",3);
}

function canExtendMagic() {
    // At least 1/2 Magic or 1 Bottle
    return has("mpupgrade",1) || has("bottle",1);
}

function canKillMostThings(enemies = 5) {
    // Sword
    // Somaria
    // Bombs and few enemies
    // Byrna and few enemies or Magic Extension
    // Bow
    // Hammer
    // FRod
    return (hasSword()
        && (has("swords.uncle") || has("swords.swordless")))        // FIXME: Swords Uncle/Swordless
        || has("somaria")
        || (has("bombs") && enemies < 6)
        || (has("byrna") && (enemies < 6 || canExtendMagic()))
        || canShootArrows()
        || has("hammer")
        || has("firerod");
}

function canGetGoodBee() {
    // Net
    // Bottle
    // Dash or Quake
    return has("net")
        && has("bottle")
        && (canDash()
            || (hasSword() && has("quake")));
}

function canBeatAga1(logic) {
    // Aga's Alive
    // Cape or Master Sword
    // At least Sword1
    let darkNav = logic == "minor" && canDarkNav();
    let haveLamp = has("lantern");
    let ret = !has("agahnim")
            && (has("cape") || hasSword(2))
            && hasSword();

    if(ret) {
        if(haveLamp) {
            return "agahnim";
        } else if(darkNav) {
            return "glitchagahnim";
        }
    } else {
        return false;
    }
}

function canOpenGT() {
    let ret = true;

    // Missing a Crystal, fail
    for(i = 1; i <= 7; i++) {
        if(! has("crystal" + i)) {
            ret = false;
        }
    }

    // SMALttPR
    // Show Portals in either Z3 or M3
    // Mother Brain defeated
    if(
        roomid == "smalttpr"
        && trackerData
        && (
            (
                trackerData.zelda3
                && trackerData.zelda3.showPortals
            ) ||
            (
                trackerData.metroid3
                && trackerData.metroid3.showPortals
            )
        )
      ) {
        ret = ret && has("motherbrain");
    }

    return ret;
}

function isBunny(regionName = "",regionSubname = "") {
    // Dark Places
    let darkRegions = [
        "PalaceOfDarkness",
        "SwampPalace",
        "ThievesTown",
        "SkullWoods",
        "IcePalace",
        "MiseryMire",
        "TurtleRock"
    ];

    // Light:   Link
    // Dark:    Bunny
    let notBunny = "light";
    let bunny = "dark";

    // Inverted
    // Light:   Bunny
    // Dark:    Link
    if(has("state.inverted")) {
        notBunny = "dark";
        bunny = "light";
    } else {
        // Not Inverted
        // Add GT as a Dark Place
        darkRegions.push("GanonsTower");
    }

    // Checking Light World
    let world = "light";
    if(((regionName.toLowerCase().indexOf("dark")) > -1) || (darkRegions.indexOf(regionName) > -1)) {
        // Checking Dark World
        world = "dark";
    }

    // We're a bunny if we match Bunny World and No Pearl
    return (world == bunny) && !has("moonpearl");
}

function canAccessLightWorld() {
    // Not Inverted, we start in LW
    if(!has("state.inverted")) {
        return true;
    } else if(has("state.inverted")) {
        // Can we access LW?
        let warps = new HyruleWarpsMain();
        warps.initNoMajorGlitches();
        let south = warps.locations["South Hyrule Teleporter (Dark)"].glitchless();
        let east = warps.locations["East Hyrule Teleporter (Dark)"].glitchless();
        let west = warps.locations["Kakariko Teleporter (Dark)"].glitchless();
        let gate = warps.locations["Castle Gate (Dark)"].glitchless();

        return south || east || west || gate;
    }
}

function canDarkNav() {
    // Can't DarkNav if we can see
    return !has("lantern");
}

function canFakeFlipper() {
    // Can't Fake Flipper if we can Swim
    return !canSwim();
}

function canWaterwalk() {
    // Fake Flips and Pearl
    return canFakeFlipper() && has("moonpearl");
}

function canWaterwalkStored() {
//    return canWaterwalk();
    return false;
}

function canFakePowder() {
    // Somaria
    // Shroom
    // Haven't done Shroom Quest
    let potionShop = chests.zelda3.find(function(e) { return e.name == "Potion Shop"; } );
    return has("somaria") && has("mushroom") && !potionShop.isOpened;
}

function glitchedLinkInDarkWorld() {
    return has("moonpearl") || has("bottle",1);
}

// Can we kill the Wizard?
function canGoBeatAgahnim1(allowOutOfLogicGlitches) {
    let canKillWizard = canBeatAga1(allowOutOfLogicGlitches ? "minor" : "");
    return canKillWizard !== false;
}

function canEnterNorthEastDarkWorld(logic, agahnimCheck, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return has("agahnim")
                || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches))
                || (has("moonpearl")
                        && ((canLiftDarkRocks() && (canDash() || canSwim()))
                                || (has("hammer") && canLiftRocks())))
                || (canEnterWestDeathMountain(logic, allowOutOfLogicGlitches)
                        && (has("bottle",1)
                                || (has("mirror") && canSpinSpeed())
                                || (has("moonpearl") && (has("mirror") || canDash()))));
    }
    else if (logic === 'owGlitches') {
        return has("agahnim")
                || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches))
                || (has("moonpearl")
                        && ((canLiftDarkRocks() && (canDash() || canSwim()))
                                || (has("hammer") && canLiftRocks())))
                || (canEnterWestDeathMountain(logic, allowOutOfLogicGlitches)
                        && ((has("mirror") && canSpinSpeed())
                                || (has("moonpearl") && (has("mirror") || canDash()))));
    }
    else if (logic === 'glitchless') {
        return has("agahnim")
                || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches))
                || (has("hammer") && canLiftRocks() && has("moonpearl"))
                || (canLiftDarkRocks() && canSwim() && has("moonpearl"))
                || (canAccessDarkWorldPortal() && canSwim() && has("moonpearl"));
    }
}

function canEnterNorthWestDarkWorld(logic, agahnimCheck, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches)
                || (has("moonpearl")
                        && (canLiftDarkRocks()
                                || (has("hammer") && canLiftRocks())
                                || ((has("agahnim") || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches)))
                                        && canGrapple()
                                        && (has("hammer") || canLiftRocks() || canSwim()))));
    }
    else if (logic === 'owGlitches') {
        return canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches) && (has("mirror") || (canDash() && has("moonpearl")))
                || (has("moonpearl")
                        && (canLiftDarkRocks()
                                || (has("hammer") && canLiftRocks())
                                || ((has("agahnim") || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches)))
                                        && canGrapple()
                                        && (has("hammer") || canLiftRocks() || canSwim()))));
    }
    else if (logic === 'glitchless') {
        return has("moonpearl")
                && ((canEnterNorthEastDarkWorld('glitchless', agahnimCheck, allowOutOfLogicGlitches) && (canGrapple() && (canSwim() || canLiftRocks() || has("hammer"))))
                        || (has("hammer") && canLiftRocks())
                        || canLiftDarkRocks());
    }
}

function canEnterSouthDarkWorld(logic, agahnimCheck, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return canEnterWestDeathMountain(logic, allowOutOfLogicGlitches)
                || (has("moonpearl")
                        && (canLiftDarkRocks()
                                || (has("hammer") && canLiftRocks())
                                || ((has("agahnim") || (agahnimCheck && canGoBeatAgahnim1(allowOutOfLogicGlitches)))
                                        && (has("hammer") || (canGrapple() && (canSwim() || canLiftRocks()))))));
    }
    else if (logic === 'owGlitches') {
        return ((has("moonpearl")
                && (canLiftDarkRocks()
                        || (has("hammer") && canLiftRocks())
                        || (has("agahnim") && (has("hammer")
                                || (canGrapple() && (canLiftRocks() || canSwim()))))))
                || ((has("mirror") || (canDash() && has("moonpearl")))
                        && canEnterWestDeathMountain(logic, allowOutOfLogicGlitches))
                || (canAccessDarkWorldPortal() && canSwim()));
    }
    else if (logic === 'glitchless') {
        return has("moonpearl")
                && (canLiftDarkRocks()
                        || (has("hammer") && canLiftRocks())
                        || (canEnterNorthEastDarkWorld('glitchless', agahnimCheck, allowOutOfLogicGlitches)
                                && (has("hammer")
                                        || (canGrapple() && (canSwim() || canLiftRocks())))));
    }
}

function canEnterMireArea(logic, agahnimCheck, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return (has("bottle") && canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches))
                || (canLiftDarkRocks() && (canFly() || has("bottle") || canDash()))
                || (glitchedLinkInDarkWorld() && canDash() && canEnterSouthDarkWorld('majorGlitches', agahnimCheck, allowOutOfLogicGlitches));
    }
    else if (logic === 'owGlitches') {
        return (canLiftDarkRocks() && (canFly() || canDash()))
                || (has("moonpearl") && has("boots") && canEnterSouthDarkWorld('owGlitches', agahnimCheck, allowOutOfLogicGlitches));
    }
    else if (logic === 'glitchless') {
        return (canFly() && canLiftDarkRocks()) || canAccessMiseryMirePortal();
    }
}

function canEnterWestDeathMountain(logic, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return canDash()
                || has("bottle",1)
                || canFly()
                || (canLiftRocks() && (has("lantern") || allowOutOfLogicGlitches));
    }
    else if (logic === 'owGlitches') {
        return canDash()
                || canFly()
                || (canLiftRocks() && (has("lantern") || allowOutOfLogicGlitches));
    }
    else if (logic === 'glitchless') {
        return canFly()
                || (canLiftRocks() && (has("lantern") || allowOutOfLogicGlitches))
                || canAccessDeathMountainPortal();
    }
}

function canEnterEastDeathMountain(logic, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return canDash()
                || (canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches) && (canGrapple() || has("mirror")));
    }
    else if (logic === 'owGlitches') {
        return canDash()
                || (canEnterWestDeathMountain('owGlitches', allowOutOfLogicGlitches) && (canGrapple() || (has("mirror") && has("hammer"))));
    }
    else if (logic === 'glitchless') {
        return canEnterWestDeathMountain('glitchless', allowOutOfLogicGlitches) && (canGrapple() || (has("mirror") && has("hammer")));
    }
}

function canEnterEastDarkWorldDeathMountain(logic, allowOutOfLogicGlitches) {
    if (logic === 'majorGlitches') {
        return has("moonpearl")
                || (has("bottle") && canDash())
                || ((canLiftDarkRocks() || (has("hammer") && canDash())) && canEnterEastDeathMountain('majorGlitches', allowOutOfLogicGlitches))
                || (has("mirror") && canEnterWestDeathMountain('majorGlitches', allowOutOfLogicGlitches));
    }
    else if (logic === 'owGlitches') {
        return (has("moonpearl") && canDash())
                || ((canLiftDarkRocks() || (has("hammer") && canDash()))
                        && canEnterEastDeathMountain('owGlitches', allowOutOfLogicGlitches));
    }
    else if (logic === 'glitchless') {
        return canLiftDarkRocks() && canEnterEastDeathMountain('glitchless', allowOutOfLogicGlitches);
    }
}

// app/Support/ItemCollection.php
// SM Ability functions
function canDestroyBombWalls() {    // Morph Ball, Bombs || Power Bombs, Screw Attack; Can pass through barriers that must be destroyed
    return (canMorph()
        && (canUseMorphBombs()
            || canUsePowerBombs()))
    || has("screw");
}
function canEnterAndLeaveGauntlet() {    // Gauntlet area is complicated apparently
    if(trackerData.metroid3.mapLogic == "casualLogic") {
        return (canMorph() && (canFlySM() || canDashSM()))
            && (canIbj()
                || (canUsePowerBombs() && has("powerbomb",2))
                || has("screw"));
    } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
        return (canMorph() && (canUseMorphBombs() || has("powerbomb",2)))
            || has("screw")
            || (canDashSM() && canUsePowerBombs() && hasEnergyReserves(2));
    }
}
function canCrystalFlash() {    // Refill HP
    return has("missile",2)
        && has("supermissile",2)
        && has("powerbomb",3)
        && canMorph();
}
function canCwj() {    // FIXME: Not Casual
    return true;
}
function canDashSM() {    // SM: Speed Booster
    return has("speed");
}
function canDamageBoostJump() {    // Requires accurate positioning, #FIXME: Not Casual
    return true;
}
function canFlySM() {    // SM: Infinite Bomb Jump or Space Jump
    return canIbj() || has("space");
}
function canGrappleSM() {    // SM: Grapple Beam
    return has("grappling");
}
function canGravityJump() {    // FIXME: Not Casual
    return canSwimSM();
}
function canHellRun() {    // Varia or enough health
    return heatProof() || hasEnergyReserves(5);
}
function canHiJump() {
    return has("hijump");
}
function canIbj() {    // Infinite Bomb Jump, #FIXME: Not Casual
    return canUseMorphBombs();
}
function canMachball() {    // #FIXME: Not Casual
    return canMorph();
}
function canMorph () {
    return has("morph");
}
function canOpenGreenDoors() {
    return has("supermissile",1);
}
function canGGG() {
    return canOpenGreenDoors();
}
function canOpenRedDoors() {
    return has("missile",1) || canOpenGreenDoors();
}
function canOpenYellowDoors() {
    return canUsePowerBombs();
}
function canPassBombPassages() {    // Power Bombs || Infinite Bomb Jump
    return canUsePowerBombs() || canIbj();
}
function canShortCharge() {    // FIXME: Not Casual
    return canDashSM();
}
function canSpringBall() {
    return canMorph() && has("springball");
}
function canSpringBallJump() {    // FIXME: Not Casual
    return has("springball");
}
function canSwimSM() {    // SM: Gravity Suit
    return has("gravity");
}
function canUseMorphBombs() {
    return canMorph() && has("bombs");
}
function canUsePowerBombs() {
    return canMorph() && has("powerbomb");
}
function canWalljump() {
    return true;
}
function canYba($amount = 1) {    // FIXME: Not Casual
    return has("bottle",$amount);
}
function hasEnergyReserves(amount) {    // Total Energy Tanks (including Reserve Tanks)
    return getHas("etank") + getHas("rtank") >= amount;
}
function heatProof() {    // Varia Suit
    return has("varia");
}

// TLoZ Ability functions
function canShootArrowsZ1() {
    // Bow
    // Wood Arrows or Silver Arrows
    return canShootArrows() && (has("woods") || has("silvers"));
}
function canLightBushes() {
    return has("candle");
}
function canSwimZ1() {
    return has("raft");
}

// SM Bosses
function canDefeatBotwoon() {
    switch(trackerData.metroid3.mapLogic) {
        case "tourneyLogic":
            return has("ice") || canDashSM() || canAccessMaridiaPortal();
        case "casualLogic":
            return canDashSM() || canAccessMaridiaPortal();
    }

}
function canDefeatDraygon() {
    switch(trackerData.metroid3.mapLogic) {
        case "tourneyLogic":
            return canDefeatBotwoon() && canSwimSM() && ((canDashSM() && canHiJump()) || canFlySM());
        case "casualLogic":
            return canDefeatBotwoon() && canSwimSM();
    }
}

// SM -> ALttP portals
function canAccessLightWorldPortal() {    // Crateria Map Room -> Link's Fortune Teller
    return true;
}
function canAccessDeathMountainPortal() { // Norfair Map Room -> DM (Old Man exit)
    return ((canDestroyBombWalls() || canDashSM())
    && (canOpenGreenDoors() && canMorph()));
}
function canAccessMiseryMirePortal() { // Lower Norfair (Golden Torizo Energy Refill) -> Mire (Great Fairy, east "Entrance")
    if(trackerData.metroid3.mapLogic == "casualLogic") {
        return heatProof()
            && canOpenGreenDoors()
            && canOpenYellowDoors()
            && (canSwimSM() && has("space"));
    } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
        return heatProof()
            && canOpenGreenDoors()
            && (canHiJump() || canSwimSM())
            && canOpenYellowDoors();
    }
}
function canAccessDarkWorldPortal() { // Maridia Missile Refill -> DW (DW Ice Rod Right)
    if(trackerData.metroid3.mapLogic == "casualLogic") {
        return canUsePowerBombs() && canOpenGreenDoors() && canSwimSM() && canDashSM();
    } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
        return canUsePowerBombs()
            && canOpenGreenDoors()
            && (has("charge") || (canOpenGreenDoors() && canOpenRedDoors()))
            && (canSwimSM() || (canHiJump() && has("ice") && canGrappleSM()))
            && (has("ice") || (canDashSM() && canSwimSM()));
    }
}

// ALttP -> SM portals
function canAccessCrateriaPortal() { // Fortune Teller -> Crateria Map Room
    return true;
}
function canAccessNorfairPortal() { // DM (Old Man exit) -> Norfair Map Room
    // Death Mountain Access
    return canFly() || (canLiftRocks() && has("lantern"));
}
function canAccessLowerNorfairPortal() { // Mire (Great Fairy, east "Entrance") -> Lower Norfair (Golden Torizo Energy Refill)
    return canFly() && canLiftDarkRocks();
}
function canAccessMaridiaPortal() { // DW (DW Ice Rod Right) -> Maridia Missile Refill
    if(trackerData.metroid3.mapLogic == "casualLogic") {
        return has("moonpearl")
            && canSwim()
            && canSwimSM()
            && canMorph()
            && (has("agahnim")
                || (has("hammer") && canLiftRocks())
                || canLiftDarkRocks());
    } else if(trackerData.metroid3.mapLogic == "tourneyLogic") {
        return has("moonpearl")
            && canSwim()
            && (canSpringBallJump() || canHiJump() || canSwimSM())
            && canMorph()
            && (has("agahnim")
                || (has("hammer") && canLiftRocks())
                || canLiftDarkRocks());
    }
}
