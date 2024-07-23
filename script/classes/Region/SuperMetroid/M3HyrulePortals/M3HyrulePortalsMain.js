class M3HyrulePortalsMain extends M3HyrulePortals {
  constructor(name = "M3HyrulePortals", subname = "Main") {
    super(name,subname);
    let regionName = name + subname;
    this.locations = new LocationCollection([
        new Location("Portal","ALttPR Portal: Link's Fortune Teller",331,133,"CrateriaCentral"),
        new Location("Portal","ALttPR Portal: Death Mountain Cave",637,763,"M3NorfairWest"),
        new Location("Portal","ALttPR Portal: Dark World Ice Cave Right",1105,493,"MaridiaInner"),
        new Location("Portal","ALttPR Portal: Misery Mire East 'Entrance'",853,961,"LowerNorfairWest")
    ],this);
  }

  initCasual() {
    this.locations["ALttPR Portal: Link's Fortune Teller"].casualLogic = function() {
        let cc = new CrateriaCentral("","",false);
        cc.initCasual();
        return (cc.canEnter.casualLogic() && canAccessLightWorldPortal()) || canAccessCrateriaPortal();
    }
    this.locations["ALttPR Portal: Death Mountain Cave"].casualLogic = function() {
        let nw = new M3NorfairWest("","",false);
        nw.initCasual();
        return (nw.canEnter.casualLogic() && canAccessDeathMountainPortal()) || canAccessNorfairPortal();
    }
    this.locations["ALttPR Portal: Dark World Ice Cave Right"].casualLogic = function() {
        let mi = new MaridiaInner("","",false);
        mi.initCasual();
        return (mi.canEnter.casualLogic() && canAccessDarkWorldPortal()) || canAccessMaridiaPortal();
    }
    this.locations["ALttPR Portal: Misery Mire East 'Entrance'"].casualLogic = function() {
        let lnw = new LowerNorfairWest("","",false);
        lnw.initCasual();
        return (lnw.canEnter.casualLogic() && canAccessMiseryMirePortal()) || canAccessLowerNorfairPortal();
    }
  }

  initTournament() {
    this.initCasual();
  }
}
