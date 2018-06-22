class DeathMountainEast extends DeathMountain {
  constructor(name = "DeathMountain", subname = "East", buildLocations = true) {
	super(name,subname,buildLocations);
	let regionName = name + subname;
	if(this.buildLocations) {
		this.locations = new LocationCollection([
			new Location("Chest","Spiral Cave","39.9%","9.3%",regionName),
			new Location("Chest","Mimic Cave","42.6%","9.3%",regionName,{equipment:"(%%mirror%% outside of Turtle Rock)(Yellow = %%medallion0%% unknown OR possible w/out %%firerod%%)"}),
//			new Location("Chest","Paradox Cave Lower - Far Left","41.4%","17.1%",regionName),
//			new Location("Chest","Paradox Cave Lower - Left","41.4%","17.1%",regionName),
//			new Location("Chest","Paradox Cave Lower - Right","41.4%","17.1%",regionName),
//			new Location("Chest","Paradox Cave Lower - Far Right","41.4%","17.1%",regionName),
//			new Location("Chest","Paradox Cave Upper - Left","41.4%","17.1%",regionName,{equipment:"%%bomb%%"}),
//			new Location("Chest","Paradox Cave Upper - Right","41.4%","17.1%",regionName,{equipment:"%%bomb%%"}),
			new Location("Chest","Paradox Cave","41.4%","17.1%",regionName,{equipment:"(5 + 2 %%bomb%%)"}),
			new Location("Standing","Floating Island","40.2%","3.0%",regionName,{equipment:"%%mirror%%"})
		],this);
	}
  }

  initNoMajorGlitches() {
	if(this.buildLocations) {
		this.locations["Mimic Cave"].glitchless = function() {
			let tr = new DungeonsTurtleRock("","",false);
			tr.initNoMajorGlitches();

			return has("mirror") && has("keyd7",2)
				&& tr.canEnter.glitchless();
		}
		this.locations["Floating Island"].glitchless = function() {
			return has("mirror") && has("pearl")
				&& canLiftDarkRocks();
		}
	}

	this.canEnter.glitchless = function() {
		let wdm = new DeathMountainWest("","",false);
		wdm.initNoMajorGlitches();

		return wdm.canEnter.glitchless()
			&& ((has("hammer") && has("mirror"))
			|| canGrapple());
	}
  }

  initOverworldGlitches() {
    this.initNoMajorGlitches();

	if(this.buildLocations) {
	    this.locations["Mimic Cave"].owglitches = function() {
			let edwdm = new DarkWorldDeathMountainEast("","",false);
			edwdm.initOverworldGlitches();

			return has("hammer") && has("mirror")
				&& edwdm.canEnter.owglitches();
		}
		this.locations["Floating Island"].owglitches = function() {
			let edwdm = new DarkWorldDeathMountainEast("","",false);
			edwdm.initOverworldGlitches();

			return canDash()
				|| (has("mirror") && has("moonpearl")
					&& canLiftRocks() && edwdm.canEnter.owglitches());
		}
	}

    this.canEnter.owglitches = function() {
		let wdm = new DeathMountainWest("","",false);
		wdm.initOverworldGlitches();

		return (canDash()
			|| ((canGrapple() || has("mirror"))
				&& wdm.canEnter.owglitches()));
    }
  }

  initMajorGlitches() {
	this.initOverworldGlitches();

	if(this.buildLocations) {
		this.locations["Floating Island"].majorglitches = function() {
			let edwdm = new DarkWorldDeathMountainEast("","",false);
			edwdm.initMajorGlitches();

			return canDash()
				|| (has("mirror") && glitchedLinkInDarkWorld()
					&& canLiftRocks() && edwdm.canEnter.majorglitches());
		}
	}
  }
}
