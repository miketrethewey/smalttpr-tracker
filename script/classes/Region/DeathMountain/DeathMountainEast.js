class DeathMountainEast extends DeathMountain {
  constructor(name = "DeathMountain", subname = "East") {
	super(name,subname);
	let regionName = name + subname;
	this.locations = new LocationCollection([
		new Location("Chest","Spiral Cave","39.9%","9.3%",regionName),
		new Location("Chest","Mimic Cave","42.6%","9.3%",regionName,{equipment:"(%%mirror%% outside of Turtle Rock)(Yellow = %%medallion0%% unknown OR possible w/out %%firerod%%)"}),
		new Location("Chest","Paradox Cave Lower - Far Left","41.4%","17.1%",regionName),
		new Location("Chest","Paradox Cave Lower - Left","41.4%","17.1%",regionName),
		new Location("Chest","Paradox Cave Lower - Right","41.4%","17.1%",regionName),
		new Location("Chest","Paradox Cave Lower - Far Right","41.4%","17.1%",regionName),
		new Location("Chest","Paradox Cave Upper - Left","41.4%","17.1%",regionName,{equipment:"%%bomb%%"}),
		new Location("Chest","Paradox Cave Upper - Right","41.4%","17.1%",regionName,{equipment:"%%bomb%%"})
	],this);
  }

  initNoMajorGlitches() {
	this.locations["Mimic Cave"].glitchless = function() {
		var tr = new TurtleRock();
		tr.initNoMajorGlitches();

		return has("mirror") && has("keyd7",2)
			&& tr.canEnter.glitchless();
	}
	this.locations["Floating Island"].glitchless = function() {
		return has("mirror") && has("pearl")
			&& canLiftDarkRocks();
	}

	this.canEnter.glitchless = function() {
		var wdm = new DeathMountainWest();
		wdm.initNoMajorGlitches();

		return wdm.canEnter.glitchless()
			&& ((has("hammer") && has("mirror"))
			|| canGrapple());
	}
  }

  initOverworldGlitches() {
    initNoMajorGlitches();

    this.locations["Mimic Cave"].owglitches = function() {
		var edwdm = new DarkWorldDeathMountainEast();
		edwdm.initOverworldGlitches();

		return has("hammer") && has("mirror")
			&& edwdm.canEnter.owglitches();
	}
	this.locations["Floating Island"].owglitches = function() {
		var edwdm = new DarkWorldDeathMountainEast();
		edwdm.initOverworldGlitches();

		return canDash()
			|| (has("mirror") && has("moonpearl")
				&& canLiftRocks() && edwdm.canEnter.owglitches();
	}

    this.canEnter.owglitches = function() {
		var wdm = new DeathMountainWest();
		wdm.initOverworldGlitches();

		return (canDash()
			|| ((canGrapple() || has("mirror"))
				&& wdm.canEnter.owglitches();
    }
  }

  initMajorGlitches() {
	initOverworldGlitches();

	this.locations["Floating Island"].majorglitches = function() {
		var edwdm = new DarkWorldDeathMountainEast();
		edwdm.initMajorGlitches();

		return canDash()
			|| (has("mirror") && glitchedLinkInDarkWorld()
				&& canLiftRocks() && edwdm.canEnter.majorglitches();
	}
  }
}