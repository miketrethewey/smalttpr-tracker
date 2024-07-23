class Z3DungeonsTowerOfHera extends Z3Dungeons {
  constructor(name = "Z3Dungeons", subname = "TowerOfHera", buildLocations = true) {
    super(name,subname,buildLocations);
    let regionName = name + subname;
    if(this.buildLocations) {
        this.locations = new LocationCollection([
            new Location("SpawnableChest","Tower of Hera - Big Key Chest","","",regionName),
            new Location("Standing","Tower of Hera - Basement Cage","","",regionName),
            new Location("Chest","Tower of Hera - Map Chest","","",regionName),
            new Location("Chest","Tower of Hera - Compass Chest","","",regionName),
            new Location("BigChest","Tower of Hera - Big Chest","","",regionName),
            new Location("Event","Tower of Hera - Moldorm","31.0%","5.5%",regionName)
        ],this);
    }

    this.boss = new BossMoldorm();
  }

  initNoMajorGlitches() {
    let boss = this.boss;
    let dungeon = this;

    if(this.buildLocations) {
        this.locations["Tower of Hera - Big Key Chest"].glitchless = function() {
            return canLightTorches() && has("key");
        }
        this.locations["Tower of Hera - Compass Chest"].glitchless =
        this.locations["Tower of Hera - Big Chest"].glitchless = function() {
            return has("bigkey");
        }
    }
    this.locations["Tower of Hera - Moldorm"].glitchless = function() {
        return has("key") && has("bigkey")
            && boss.canBeat();
    }

    this.canEnter.glitchless = function() {
        let wdm = new DeathMountainWest("","",false);
        wdm.initNoMajorGlitches();

        return (! isBunny(dungeon.subname)) && (has("mirror") || (canGrapple() && has("hammer")))
            && wdm.canEnter.glitchless();
    }
    this.canComplete.glitchless = function() {
        return dungeon.locations["Tower of Hera - Moldorm"].glitchless();
    }
    this.canGetChest.glitchless = function() {
        let mychests = trackerData.zelda3.dungeonchests[2];
        if(dungeon.canEnter.glitchless()) {
            if(canLightTorches() && (mychests === 2 || hasSword() || has("hammer"))) {
                return true;
            } else {
                return "partial";
            }
        }
    }
  }

  initMinorGlitches() {
    this.initNoMajorGlitches();

    let dungeon = this;

    this.canEnter.minorGlitches = function() {
        let ret = this.glitchless();

        if(ret) {
            return ret;
        }

        let wdm = new DeathMountainWest("","",false);
        wdm.initMinorGlitches();

        ret = (! isBunny(dungeon.subname)) && (has("mirror") || (canGrapple() && has("hammer")));
        if(ret) {
            if(wdm.canEnter.minorGlitches()) {
                return wdm.canEnter.minorGlitches();
            }
        }
    }

    this.canGetChest.minorGlitches = function() {
        let mychests = trackerData.zelda3.dungeonchests[2];
        let glitch = dungeon.canEnter.minorGlitches();
        let type = typeof glitch;

        let ret = dungeon.canGetChest.glitchless();

        if(ret) {
            return ret;
        }

        if(glitch) {
            if(canLightTorches() && (mychests === 2 || hasSword() || has("hammer"))) {
                return type == "string" ? glitch : true;
            } else {
                return type == "string" ? "glitchpartial" : "partial";
            }
        }
        return false;
    }
  }

  initOverworldGlitches() {
      this.initMinorGlitches();

      this.canEnter.owGlitches = function() {
          let wdm = new DeathMountainWest("","",false);
          wdm.initOverworldGlitches();

          return (canDash()
              || ((has("mirror") || (canGrapple() && has("hammer")))
                  && wdm.canEnter.owGlitches()));
      }
  }

  initMajorGlitches() {
      this.initOverworldGlitches();

      let boss = this.boss;

      let wdm = new DeathMountainWest("","",false);
      wdm.initMajorGlitches();

      let mm = new Z3DungeonsMiseryMire("","",false);
      mm.initMajorGlitches();

      let main = function() {
          return canDash()
          || ((has("mirror") || (canGrapple() && has("hammer")))
              && wdm.canEnter.majorGlitches());
      };

      let mire = function() {
          return ((has("key",2) || has("key",3))
          && mm.canEnter.majorGlitches());
      };

      if(this.buildLocations) {
          this.locations["Tower of Hera - Big Key Chest"].majorGlitches = function() {
              return canLightTorches() && has("key");
          }
          this.locations["Tower of Hera - Compass Chest"].majorGlitches = function() {
              return (main() && has("bigkey"))
                  || mire();
          }
          this.locations["Tower of Hera - Big Chest"].majorGlitches = function() {
              return (main() && has("bigkey"))
                  || (mire() && (has("bigkey") || has("bigkey")));
          }
          this.locations["Tower of Hera - Moldorm"].majorGlitches = function() {
              return ((main() && has("bigkey"))
                      || mire())
                  && boss.canBeat();
          }
      }

      this.canEnter.majorGlitches = function() {
          return (main()
              || mire());
      }
      this.canComplete.majorGlitches = function() {
          let sp = new Z3DungeonsSwampPalace("","",false);
          sp.initMajorGlitches();

          return (((main() && has("bigkey"))
                  || (mire() && (has("bigkey") || has("bigkey"))))
              && (hasSword() || has("hammer")))
          || (this.locations["Tower of Hera - Big Chest"].majorGlitches()
              && sp.locations["Swamp Palace - Arrghus"].majorGlitches());
      }
  }
}
