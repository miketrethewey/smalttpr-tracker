class DeathMountainWest extends DeathMountain {
  constructor(name = "DeathMountain", subname = "West", buildLocations = true) {
    super(name,subname,buildLocations);
    let regionName = name + subname;
    if(this.buildLocations) {
        this.locations = new LocationCollection([
            new Location("NPC","Old Man","20.8%","20.4%",regionName),
            new Location("Standing","Spectacle Rock Cave","24.3%","14.8%",regionName),
            new Location("Tablet","Ether Tablet","21.0%","3.0%",regionName,{equipment:"%%sword2%%%%book%%"}),
            new Location("Standing","Spectacle Rock","25.4%","8.5%",regionName,{equipment:"%%mirror%%"})
        ],this);
    }
  }

  initNoMajorGlitches() {
    let region = this;

    if(this.buildLocations) {
        this.locations["Old Man"].glitchless = function() {
            return has("lantern");
        }
        this.locations["Ether Tablet"].glitchless = function() {
            if(! has("state.inverted")) {
                return (! isBunny(region.name)) && canActivateTablets()
                    && (has("mirror") || (has("hammer") && canGrapple()));
            } else if(has("state.inverted")) {
                let warps = new HyruleWarpsMain();
                warps.initNoMajorGlitches();
                return warps.locations["Turtle Rock Teleporter (Light)"].glitchless() && (! isBunny(region.name)) && canActivateTablets();
            }
        }
        this.locations["Spectacle Rock"].glitchless = function() {
            if(! has("state.inverted")) {
                return has("mirror");
            } else if(has("state.inverted")) {
                let warps = new HyruleWarpsMain();
                warps.initNoMajorGlitches();
                return warps.locations["Turtle Rock Teleporter (Light)"].glitchless();
            }
        }
    }

    this.canEnter.glitchless = function() {
        if(! has("state.inverted")) {
            return (canFly()
                || (canLiftRocks() && has("lantern"))
                || canAccessDeathMountainPortal());
        } else if(has("state.inverted")) {
            return has("lantern") && canLiftRocks();
        }
    }
  }

  initMinorGlitches() {
    let region = this;

    this.initNoMajorGlitches();

    if(this.buildLocations) {
        this.locations["Old Man"].minorGlitches = function() {
            let ret = this.glitchless();

            if(ret) {
                return ret;
            }
            if(canDarkNav()) {
                return "glitchavailable";
            }
        }
        this.locations["Ether Tablet"].minorGlitches = function() {
            let ret = this.glitchless();

            if(ret) {
                return ret;
            }

            let warps = new HyruleWarpsMain();
            warps.initNoMajorGlitches();

            let isInverted = has("state.inverted");

            if((! isInverted) || (isInverted && warps.locations["Turtle Rock Teleporter (Light)"].glitchless())) {
                if((! isBunny(region.name))) {
                    if(has("mirror") || isInverted) {
                        if(canActivateTablets()) {
                            if(canDarkNav()) {
                                return "glitchavailable";
                            } else if(has("lantern")) {
                                return "available";
                            }
                        }
                        if(canRead()) {
                            if(canDarkNav()) {
                                return "glitchviewable";
                            } else if(has("lantern")) {
                                return "viewable";
                            }
                        }
                    }
                }
            }
        }
        this.locations["Spectacle Rock"].minorGlitches = function() {
            let ret = this.glitchless();

            if(ret) {
                return ret;
            }
            if(has("lantern")) {
                return "viewable";
            }
            if(canDarkNav()) {
                return "glitchviewable";
            }
        }
    }

    this.canEnter.minorGlitches = function() {
        let ret = this.glitchless();

        if(ret) {
            return ret;
        }
        if(canLiftRocks() && canDarkNav()) {
            return "glitchavailable";
        }
    }
  }

  initOverworldGlitches() {
    this.initMinorGlitches();

    if(this.buildLocations) {
        this.locations["Ether Tablet"].owGlitches = function() {
            let toh = new Z3DungeonsTowerOfHera("","",false);
            toh.canEnter.owGlitches();

            return canActivateTablets()
                && toh.canEnter.owGlitches();
        }
        this.locations["Spectacle Rock"].owGlitches = function() {
            return canDash()
                || has("mirror");
        }
    }

    this.canEnter.owGlitches = function() {
        if(! has("state.inverted")) {
            return (canDash()
                || canFly() || (canLiftRocks() && has("lantern")));
        }
    }
  }

  initMajorGlitches() {
    this.initOverworldGlitches();

    this.canEnter.majorGlitches = function() {
        if(! has("state.inverted")) {
            return (canDashSM() || has("bottle")
                || canFly() || (canLiftRocks() && has("lantern")));
        }
    }
  }
}
