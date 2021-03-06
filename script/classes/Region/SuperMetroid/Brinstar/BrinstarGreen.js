class BrinstarGreen extends Brinstar {
  constructor(name = "Brinstar", subname = "Green") {
	super(name,subname);
	let regionName = name + subname;
	this.locations = new LocationCollection([
		new Location("Chozo","Power Bomb (green Brinstar bottom)",133,475,regionName,{equipment:"%%morph%%"}),
		new Location("","Missile (green Brinstar below super missile)",115,421,regionName,{equipment:"%%missile%%"}),
		new Location("","Super Missile (green Brinstar top)",97,403,regionName),
		new Location("Chozo","Reserve Tank, Brinstar",151,421,regionName),
		new Location("Hidden","Missile (green Brinstar behind missile)",169,406,regionName,{equipment:"%%missile%%%%morph%%"}),
		new Location("","Missile (green Brinstar behind reserve tank)",169,421,regionName,{equipment:"%%missile%%%%morph%%"}),
		new Location("","Energy Tank, Etecoons",25,529,regionName,{equipment:"%%powerbomb%%"}),
		new Location("","Super Missile (green Brinstar bottom)",7,529,regionName,{equipment:"%%powerbomb%%%%supermissile%%"})
	],this);
  }

  initNormal() {
  	this.locations["Power Bomb (green Brinstar bottom)"].normalLogic = function() {
  		return canUsePowerBombs();
  	}
  	this.locations["Missile (green Brinstar below super missile)"].normalLogic = function() {
  		return canPassBombPassages() && canOpenRedDoors();
  	}
  	this.locations["Super Missile (green Brinstar top)"].normalLogic = function() { // Different for Hard Logic
  		return canOpenRedDoors() && canDashSM();
  	}
  	this.locations["Reserve Tank, Brinstar"].normalLogic = function() { // Different for Hard Logic
  		return canOpenRedDoors() && canDashSM();
  	}
  	this.locations["Missile (green Brinstar behind missile)"].normalLogic = function() { // Different for Hard Logic
  		return canDashSM() && canPassBombPassages() && canOpenRedDoors();
  	}
  	this.locations["Missile (green Brinstar behind reserve tank)"].normalLogic = function() { // Different for Hard Logic
  		return canDashSM() && canOpenRedDoors() && canMorph();
  	}
  	this.locations["Energy Tank, Etecoons"].normalLogic = function() {
  		return canUsePowerBombs();
  	}
  	this.locations["Super Missile (green Brinstar bottom)"].normalLogic = function() {
  		return canUsePowerBombs() && canOpenGreenDoors();
  	}

    this.canEnter.normalLogic = function() {
      // From Crateria:West
      return canDestroyBombWalls() || canDashSM();
    }
  }

  initHard() {
    this.initNormal();

  	this.locations["Super Missile (green Brinstar top)"].hardLogic = function() {
      // Mockball
  		return canOpenRedDoors()
  			&& (canMorph() || canDashSM());
  	}
  	this.locations["Reserve Tank, Brinstar"].hardLogic = function() {
      // Mockball
  		return canOpenRedDoors()
  			&& (canMorph() || canDashSM());
  	}
  	this.locations["Missile (green Brinstar behind missile)"].hardLogic = function() {
      // Mockball
  		return (canPassBombPassages() || (canMorph() && has("screw")) && canOpenRedDoors());
  	}
  	this.locations["Missile (green Brinstar behind reserve tank)"].hardLogic = function() {
      // Mockball
  		return canOpenRedDoors() && canMorph();
  	}
  }
}
