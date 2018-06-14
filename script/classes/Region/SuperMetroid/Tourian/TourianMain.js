class TourianMain extends Tourian {
  constructor(name = "Tourian", subname = "Main") {
	super(name,subname);
	let regionName = name + subname;
	this.locations = new LocationCollection([
		new Location("Event","Mother Brain",133,349,regionName)
	],this);
  }

  initCasual() {
    this.canEnter.casualLogic = function() {
      return has("phantoon")
      	&& has("draygon")
      	&& has("ridley")
      	&& has("kraid");
    }
    this.canComplete.casualLogic = function() {
      return this.canEnter.casualLogic();
    }
  }

  initTournament() {
	this.initCasual();
  }
}
