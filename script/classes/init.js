function initClasses(useGame) {
    var boss = 0;
    for(var gameName in regionNames) {
        // GTFO if we're using the oldstyle database
        if(gameName == "zelda3" && zeldaMode == "oldstyle") {
            continue;
        }
        if(gameName == useGame) {
            game = regionNames[gameName];
            // Cycle through regions
            for(var regionName in game) {
                region = game[regionName];
                for(var segment in region) {
                    // Instantiate region
                    var segmentName = region[segment];
                    var regionClassName = fix_region(regionName) + fix_region(segmentName);
                    var regionObject = eval("new " + regionClassName + "()");
                    var universe = useGame.replace(/[^A-Za-z]/g, '');

                    if(universe == "zelda") {
                        regionObject.initMajorGlitches();
                    }
                    if(universe == "metroid") {
                        regionObject.initTournament();
                    }

                    // Save region object
                    regionObjects[regionClassName] = regionObject;

                    var total = 0;

                    // Cycle through locations
                    for(var location in regionObject.locations) {
                        location = regionObject.locations[location];

                        var output = "";
                        output += location.type + ": ";

                        // Create location element
                        var d = document.createElement("div");
                        d.innerHTML = location.name;
                        if(location.type == "Event") {
                            d.innerHTML = location.name.split('-')[0];
                        }
                        var title = d.textContent.trim() || d.innerText.trim() || d.innerHTML.trim();
                        var props = {
                            name: location.name,
                            x: location.x,
                            y: location.y,
                            titleEquipment: title,
                            titleStripped: title,
                            type: location.type,
                            region: location.region,
                        };
                        // Zelda has Glitch levels
                        if(universe == "zelda") {
                            props.canAccess = {
                                glitchless: location.glitchless,
                                minorGlitches: location.minorGlitches,
                                owGlitches: location.owGlitches,
                                majorGlitches: location.majorGlitches
                            };
                        }
                        // Metroid has Logic levels
                        if(universe == "metroid") {
                            props.canAccess = {
                                casualLogic: location.casualLogic,
                                tourneyLogic: location.tourneyLogic
                            };
                        }
                        // Load mini icons
                        if(location.equipment) {
                            var regex = /%%([\w]+)%%/g;
                            var equip = location.equipment;
                            while(match = regex.exec(equip)) {
                                location.equipment = location.equipment.replace(match[0],mini(match[1]));
                            }
                            props["titleEquipment"] += " " + location.equipment;
                        }

                        total++;

                        if(total == 1) {
                            regionObjects[regionClassName] = regionObject;
                        }

                        // Special case for Event type location
                        if(location.type == "Event") {                            // Boss/Dungeon
                            var label = location.name.split('-')[0].split(' ');
                            label = label.map(x => {
                                var ret = x;
                                var smallWords = ["of"];
                                if(smallWords.indexOf(ret) > -1) {
                                    ret = ret.toLowerCase();
                                }
                                ret = ret.substring(0,1);
                                return ret;
                            });
                            if(useGame == "zelda1") {
                                label = location.name.substring(location.name.indexOf("The ") + ("The ").length).split('');
                            }

                            // Create a Dungeon location
                            var dungeon = {
                                label: label.join(''),
                                isBeatable: function() {
                                    const availability = new Availability();
                                    if(universe == "zelda") {
                                        // No Glitches
                                        if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
                                            availability.glitchless = "available";
                                        }

                                        // Minor Glitches
                                        let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
                                        let localAccess = regionObjects[this.region].canComplete.minorGlitches();
                                        let minorAvailability = "unavailable";
                                        if(regionAccess && localAccess) {
                                            minorAvailability = "available";
                                            if(typeof localAccess == "string") {
                                                minorAvailability = localAccess;
                                            } else if(typeof regionAccess == "string") {
                                                minorAvailability = regionAccess;
                                            }
                                        }
                                        availability.minorGlitches = minorAvailability;

                                        // Overworld Glitches
                                        if(regionObjects[this.region].canEnter.owGlitches() && this.canAccess.owGlitches()) {
                                            availability.owGlitches = "available";
                                        }

                                        // Major Glitches
                                        if(regionObjects[this.region].canEnter.majorGlitches() && this.canAccess.majorGlitches()) {
                                            availability.majorGlitches = "available";
                                        }
                                    }
                                    if(universe == "metroid") {
                                        if(regionObjects[this.region].canEnter.casualLogic() && this.canAccess.casualLogic()) {
                                            availability.casualLogic = "available";
                                        }
                                        if(regionObjects[this.region].canEnter.tourneyLogic() && this.canAccess.tourneyLogic()) {
                                            availability.tourneyLogic = "available";
                                        }
                                    }
                                    return availability;
                                },
                                canGetChest: function() {
                                    const availability = new Availability();
                                    if(universe == "zelda") {
                                        let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
                                        let localAccess = regionObjects[this.region].canGetChest.minorGlitches();
                                        let minorAvailability = "unavailable";
                                        if(regionAccess && localAccess) {
                                            minorAvailability = "available";
                                            if(typeof localAccess == "string") {
                                                minorAvailability = localAccess;
                                            } else if(typeof regionAccess == "string") {
                                                minorAvailability = regionAccess;
                                            }
                                        }
                                        availability.minorGlitches = minorAvailability;
                                    }
                                    return availability;
                                }
                            };
                            dungeon = Object.assign(props,dungeon);

                            dungeons[gameName].push(dungeon);
                            boss++;
                        } else {                                                // Point of Interest
                            // Could be Important, Opened, Portal, Warp or Vanills
                            var chest = {
                                isImportant: false,
                                isOpened: false,
                                isPortal: false,
                                isWarp: false,
                                isVanilla: true,
                                type: location.type.toLowerCase().replace(/ /gi, "")
                            };

                            if(location.type == "Portal" || location.type == "Warp") {    // Portal/Warp
                                chest.isPortal = location.type == "Portal";
                                chest.isWarp = location.type == "Warp";
                                chest.isAvailable = function() {
                                    const availability = new Availability();
                                    // Zelda uses Glitch levels
                                    if(universe == "zelda") {
                                        var tmp = "";

                                        if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
                                            if(typeof this.canAccess.glitchless() == "string") {
                                                tmp = this.canAccess.glitchless();
                                            } else {
                                                tmp = "active";
                                            }
                                            availability.glitchless = tmp;
                                            availability.minorGlitches = tmp;
                                            availability.owGlitches = tmp;
                                            availability.majorGlitches = tmp;
                                        } else {
                                            availability.glitchless = tmp + " inactive";
                                            availability.minorGlitches = tmp + " inactive";
                                            availability.owGlitches = tmp + " inactive";
                                            availability.majorGlitches = tmp + " inactive";
                                        }
                                    }
                                    // Metroid uses Logic levels
                                    if(universe == "metroid") {
                                        var tmp = "";

                                        if(regionObjects[this.region].canEnter.casualLogic() && this.canAccess.casualLogic()) {
                                            if(typeof this.canAccess.casualLogic() == "string") {
                                                tmp = this.canAccess.casualLogic();
                                            } else {
                                                tmp = "active";
                                            }
                                            availability.casualLogic = tmp;
                                            availability.tourneyLogic = tmp;
                                        } else {
                                            availability.casualLogic = tmp + " inactive";
                                            availability.tourneyLogic = tmp + " inactive";
                                        }
                                    }
                                    return availability;
                                };
                            } else {                                            // Chest
                                chest.isSpicy = location.spicy;
                                chest.isVanilla = location.vanilla;
                                chest.isAvailable = function() {
                                    const availability = new Availability();
                                    // Zelda uses Glitch levels
                                    if(universe == "zelda") {
                                        if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
                                            availability.glitchless = "available";
                                        }
                                        let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
                                        let localAccess = this.canAccess.minorGlitches();
                                        let minorAvailability = "unavailable";
                                        if(regionAccess && localAccess) {
                                            minorAvailability = "available";
                                            if(typeof localAccess == "string") {
                                                minorAvailability = localAccess;
                                            } else if(typeof regionAccess == "string") {
                                                minorAvailability = regionAccess;
                                            }
                                        }
                                        availability.minorGlitches = minorAvailability;
                                        if(regionObjects[this.region].canEnter.owGlitches() && this.canAccess.owGlitches()) {
                                            availability.owGlitches = "available";
                                        }
                                        if(regionObjects[this.region].canEnter.majorGlitches() && this.canAccess.majorGlitches()) {
                                            availability.majorGlitches = "available";
                                        }
                                    }
                                    // Metroid uses Logic levels
                                    if(universe == "metroid") {
                                        if(regionObjects[this.region].canEnter.casualLogic() && this.canAccess.casualLogic()) {
                                            availability.casualLogic = "available";
                                        }
                                        if(regionObjects[this.region].canEnter.tourneyLogic() && this.canAccess.tourneyLogic()) {
                                            availability.tourneyLogic = "available";
                                        }
                                    }
                                    return availability;
                                }
                            }

                            chest = Object.assign(props,chest);
                            chests[gameName].push(chest);
                        }
                    }
                }
            }
        }
    }
}
