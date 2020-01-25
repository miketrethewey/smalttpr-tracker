function initClasses(useGame) {
	var boss = 0;
	for(var gameName in regionNames) {
		if(gameName == useGame) {
			game = regionNames[gameName];
			var i = 1;
			for(var regionName in game) {
				region = game[regionName];
				for(var segment in region) {
					var segmentName = region[segment];
					var regionClassName = fix_region(regionName) + fix_region(segmentName);
					var regionObject = eval("new " + regionClassName + "()");

					if(useGame == "zelda3") {
						regionObject.initMajorGlitches();
					} else if(useGame == "metroid3") {
						regionObject.initHard();
					} else if(useGame == "averge1") {
            regionObject.initNoMajorGlitches();
          }

					regionObjects[regionClassName] = regionObject;

					var total = 0;

					for(var location in regionObject.locations) {
						location = regionObject.locations[location];

						var output = "";
						output += location.type + ": ";

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
						if(useGame == "zelda3") {
							props.canAccess = {
								glitchless: location.glitchless,
								minorGlitches: location.minorGlitches,
								owGlitches: location.owGlitches,
								majorGlitches: location.majorGlitches
							};
						} else if(useGame == "metroid3") {
							props.canAccess = {
								normalLogic: location.normalLogic,
								hardLogic: location.hardLogic
							};
						} else if(useGame == "averge1") {
              props.canAccess = {
                glitchless: location.glitchless
              }
            }
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

						if(location.type == "Event") {							// Boss/Dungeon
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

							var dungeon = {
								label: label.join(''),
								isBeatable: function() {
									const availability = new Availability();
									if(selectedGame == "zelda3") {
										// No Glitches
										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = "available";
										}

										// Minor Glitches
										let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
										let localAccess = regionObjects[this.region].canComplete.minorGlitches();
										if(regionAccess && localAccess) {
											if(typeof regionAccess == "string" || typeof localAccess == "string") {
												if(typeof localAccess == "string") {
													availability.minorGlitches = localAccess;
												} else if(typeof regionAccess == "string") {
													availability.minorGlitches = regionAccess;
												} else {
													availability.minorGlitches = "available";
												}
											} else {
												availability.minorGlitches = "available";
											}
										} else {
											availability.minorGlitches = "unavailable";
										}

										// Overworld Glitches
										if(regionObjects[this.region].canEnter.owGlitches() && this.canAccess.owGlitches()) {
											availability.owGlitches = "available";
										}

										// Major Glitches
										if(regionObjects[this.region].canEnter.majorGlitches() && this.canAccess.majorGlitches()) {
											availability.majorGlitches = "available";
										}
									} else if(selectedGame == "metroid3") {
										if(regionObjects[this.region].canEnter.normalLogic() && this.canAccess.normalLogic()) {
											availability.normalLogic = "available";
										}
										if(regionObjects[this.region].canEnter.hardLogic() && this.canAccess.hardLogic()) {
											availability.hardLogic = "available";
										}
									} else if(selectedGame == "averge1") {
										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = "available";
										}
                  }
									return availability;
								},
								canGetChest: function() {
									const availability = new Availability();
									if(selectedGame == "zelda3") {
										let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
										let localAccess = regionObjects[this.region].canGetChest.minorGlitches();
										if(regionAccess && localAccess) {
											if(typeof regionAccess == "string" || typeof localAccess == "string") {
												if(typeof regionAccess == "string") {
													availability.minorGlitches = regionAccess;
												} else if(typeof localAccess == "string") {
													availability.minorGlitches = localAccess;
												} else {
													availability.minorGlitches = "available";
												}
											} else {
												availability.minorGlitches = "available";
											}
										} else {
											availability.minorGlitches = "unavailable";
										}
									}
									return availability;
								}
							};
							dungeon = Object.assign(props,dungeon);

							dungeons[gameName].push(dungeon);
							boss++;
						} else {												// Point of Interest
							var chest = {
								isImportant: false,
								isOpened: false,
								isPortal: false,
								isWarp: false,
								isVanilla: true,
								type: location.type.toLowerCase().replace(/ /gi, "")
							};

							if(location.type == "Portal" || location.type == "Warp") {	// Portal/Warp
								chest.isPortal = location.type == "Portal";
								chest.isWarp = location.type == "Warp";
								chest.isAvailable = function() {
									const availability = new Availability();
									if(selectedGame == "zelda3") {
										var tmp = "";

										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = tmp + " active";
											availability.minorGlitches = tmp + " active";
											availability.owGlitches = tmp + " active";
											availability.majorGlitches = tmp + " active";
										} else {
											availability.glitchless = tmp + " inactive";
											availability.minorGlitches = tmp + " inactive";
											availability.owGlitches = tmp + " inactive";
											availability.majorGlitches = tmp + " inactive";
										}
									} else if(selectedGame == "metroid3") {
										var tmp = "";

										if(regionObjects[this.region].canEnter.normalLogic() && this.canAccess.normalLogic()) {
											availability.normalLogic = tmp + " active";
											availability.hardLogic = tmp + " active";
										} else {
											availability.normalLogic = tmp + " inactive";
											availability.hardLogic = tmp + " inactive";
										}
									} else if(selectedGame == "averge1") {
										var tmp = "";

										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = tmp + " active";
										} else {
											availability.glitchless = tmp + " inactive";
                    }
                  }
									return availability;
								};
							} else {											// Chest
								chest.isSpicy = location.spicy;
								chest.isVanilla = location.vanilla;
								chest.isAvailable = function() {
									const availability = new Availability();
									if(selectedGame == "zelda3") {
										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = "available";
										}
										let regionAccess = regionObjects[this.region].canEnter.minorGlitches();
										let localAccess = this.canAccess.minorGlitches();
										if(regionAccess && localAccess) {
											if(typeof regionAccess == "string" || typeof localAccess == "string") {
												if(typeof localAccess == "string") {
													availability.minorGlitches = localAccess;
												} else if(typeof regionAccess == "string") {
													availability.minorGlitches = regionAccess;
												} else {
													availability.minorGlitches = "available";
												}
											} else {
												availability.minorGlitches = "available";
											}
										} else {
											availability.minorGlitches = "unavailable";
										}
										if(regionObjects[this.region].canEnter.owGlitches() && this.canAccess.owGlitches()) {
											availability.owGlitches = "available";
										}
										if(regionObjects[this.region].canEnter.majorGlitches() && this.canAccess.majorGlitches()) {
											availability.majorGlitches = "available";
										}
									} else if(selectedGame == "metroid3") {
										if(regionObjects[this.region].canEnter.normalLogic() && this.canAccess.normalLogic()) {
											availability.normalLogic = "available";
										}
										if(regionObjects[this.region].canEnter.hardLogic() && this.canAccess.hardLogic()) {
											availability.hardLogic = "available";
										}
									} else if(selectedGame == "averge1") {
										if(regionObjects[this.region].canEnter.glitchless() && this.canAccess.glitchless()) {
											availability.glitchless = "available";
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
