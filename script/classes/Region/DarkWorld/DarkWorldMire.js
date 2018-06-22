class DarkWorldMire extends DarkWorld {
  constructor(name = "DarkWorld", subname = "Mire", buildLocations = true) {
	super(name,subname,buildLocations);
	let regionName = name + subname;
	if(this.buildLocations) {
		this.locations = new LocationCollection([
//			new Location("Chest","Mire Shed - Left","51.7%","79.5%",regionName),
//			new Location("Chest","Mire Shed - Right","51.7%","79.5%",regionName),
			new Location("Chest","Mire Shed","51.7%","79.5%",regionName)
		],this);
	}
  }

  initNoMajorGlitches() {
	if(this.buildLocations) {
//		this.locations["Mire Shed - Left"].glitchless =
//		this.locations["Mire Shed - Right"].glitchless = function() {
		this.locations["Mire Shed"].glitchless = function() {
			return has("moonpearl");
		}
	}

	this.canEnter.glitchless = function() {
		return ((canFly() && canLiftDarkRocks()) || canAccessMiseryMirePortal());
	}
  }

  initOverworldGlitches() {
	this.initNoMajorGlitches();

	if(this.buildLocations) {
//		this.locations["Mire Shed - Left"].owglitches =
//		this.locations["Mire Shed - Right"].owglitches = function() {
		this.locations["Mire Shed"].owglitches = function() {
			return has("moonpearl") || has("mirror");
		}
	}

	this.canEnter.owglitches = function() {
		let sdw = new DarkWorldSouth("","",false);
		sdw.initOverworldGlitches();

		return ((canLiftDarkRocks() && (canFly() || canDash()))
			|| (has("moonpearl") && canDash()
				&& sdw.canEnter.owglitches()));
	}
  }

  initMajorGlitches() {
	this.initOverworldGlitches();

	let wdm = new DeathMountainWest("","",false);
	wdm.initMajorGlitches();
	let sdw = new DarkWorldSouth("","",false);
	sdw.initMajorGlitches();

	this.canEnter.majorglitches = function() {
		return ((has("bottle") && wdm.canEnter.majorglitches())
			|| (canLiftDarkRocks() && (canFly() || has("bottle") || canDash()))
			|| glitchedLinkInDarkWorld() && canDash()
				&& sdw.canEnter.majorglitches());
	}
  }
}
