var cookieKeys = {
    "ts": {
        "cookieKey": "ts",
        "type": "calculated"
    },
    "gameName": {
        "cookieKey": "gameName",
        "type": "calculated"
    },
    "items": {
        "cookieKey": "items",
        "type": "calculated"
    },
    "itemValues": {
        "cookieKey": "itemValues",
        "type": "calculated"
    },
    "chestSkin": {
        "domName": "chestskin",
        "cookieKey": "chestSkin",
        "type": "option",
        "note": "Chest Skin",
        "options": ["lights","nolights","nothing"],
        "default": "lights"
    },
    "chestsImportant": {
        "cookieKey": "chestsImportant",
        "type": "calculated"
    },
    "chestsOpened": {
        "cookieKey": "chestsOpened",
        "type": "calculated"
    },
    "chestsPortal": {
        "cookieKey": "chestsPortal",
        "type": "calculated"
    },
    "iZoom": {
        "domName": "itemdivsize",
        "cookieKey": "iZoom",
        "type": "value",
        "note": "Inventory Scale",
        "default": 100
    },
    "label": {
        "cookieKey": "label",
        "type": "value"
    },
    "map": {
        "domName":      "showmap",
        "cookieKey":    "map",
        "type":         "toggle",
        "note": "Map Enabled?",
        "default": true
    },
    "mapLogic": {
        "domName": "maplogic",
        "cookieKey": "mapLogic",
        "type": "option",
        "note": "Map Logic",
        "options": {
            "zelda3": [
                "glitchless",
                "minorGlitches",
                "owGlitches",
                "majorGlitches"
            ],
            "metroid3": [
                "casualLogic",
                "tourneyLogic"
            ]
        }
    },
    "mapOHKO": {
        "domName": "ohko",
        "cookieKey": "mapOHKO",
        "type": "toggle",
        "note": "OHKO?",
        "default": false
    },
    "mapState": {
        "domName": "mapstate",
        "cookieKey": "mapState",
        "type": "option",
        "note": "Map State",
        "options": ["Standard","Open","Inverted"]
    },
    "mapSwords": {
        "domName": "swordless",
        "cookieKey": "mapSwords",
        "type": "toggle",
        "note": "Swordless?",
        "default": false
    },
    "mOrien": {
        "domID": ["mOrien1","mOrien2"],
        "domName": "maporientation",
        "cookieKey": "mOrien",
        "type": "option",
        "note": "Map Orientation",
        "options": ["Horizontal","Vertical"],
        "default": "Vertical"
    },
    "mPos": {
        "domName": "mapposition",
        "cookieKey": "mPos",
        "type": "option",
        "note": "Map Position",
        "options": ["Above","Below","Side"],
        "default": "Below"
    },
    "mZoom": {
        "domName": "mapdivsize",
        "cookieKey": "mZoom",
        "type": "value",
        "note": "Map Scale"
    },
    "nonVanilla": {
        "domName": "nonvanilla",
        "cookieKey": "nonVanilla",
        "type": "toggle",
        "note": "Z1M1: Non-vanilla Entrances?",
        "default": false
    },
    "showChests": {
        "domName": "showchest",
        "cookieKey": "showChests",
        "type": "toggle",
        "note": "Show Chests on Dungeon Item Squares?",
        "default": true
    },
    "showLabels": {
        "domName": "showlabel",
        "cookieKey": "showLabels",
        "type": "toggle",
        "note": "Show Labels on Dungeon Item Squares?",
        "default": true
    },
    "showMedals": {
        "domName": "showmedallion",
        "cookieKey": "showMedals",
        "type": "toggle",
        "note": "Show Medallions on Dungeon Item Squares?",
        "default": true
    },
    "showPortals": {
        "domName": "showportal",
        "cookieKey": "showPortals",
        "type": "toggle",
        "note": "Show Portals on Map and Foreign Items in itemgrid?",
        "default": true
    },
    "showPrizes": {
        "domName": "showcrystal",
        "cookieKey": "showPrizes",
        "type": "toggle",
        "note": "Show Prizes on Dungeon Item Squares?",
        "default": true
    },
    "showRegions": {
        "domName": "showregion",
        "cookieKey": "showRegions",
        "type": "toggle",
        "note": "Show Regions overlay on map?",
        "default": false
    },
    "showWarps": {
        "domName": "showwarp",
        "cookieKey": "showWarps",
        "type": "toggle",
        "note": "Show Warp Tiles on map?",
        "default": true
    }
};
