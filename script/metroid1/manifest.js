// Game Slug
g = "metroid1";
bosses = 1 +    // Kraid
         1 +    // Ridley
         1;     // Mother Brain

// Number of bosses to manage

// Set Manifest
manifests[g] = {
    slug: g,    // Game Slug
    title: {    // Game Title
        full:   "Metroid",
        short:  "M1",
        crumb:  "Proto Zebes"
    },
    prefix: "m1",               // Game Prefix
    altGame: [ "zelda1" ],      // Alternate Game
    regionFolder: "Metroid",    // Region Folder
    defaultGrid: [              // Default Itemgrid
        [
            "m1morph",
            "m1bombs",
            "m1long",
            "m1ice",
            "m1wave"
        ],
        [
            "m1missile",
            "m1varia",
            "m1hijump",
            "m1screw",
            "m1etank"
        ],
        [
            "m1boss0",
            "m1boss1",
            "m1kraidtotem",
            "m1ridleytotem"
        ]
    ],
    items: {
        // Item defns
        // Toggles
        m1bombs:        { name: "Bombs" },
        m1hijump:       { name: "Hi-Jump Boots" },
        m1ice:          { name: "Ice Beam" },
        m1kraidtotem:   { name: "Kraid Totem" },
        m1long:         { name: "Long Beam" },
        m1morph:        { name: "Morph Ball" },
        m1ridleytotem:  { name: "Ridley Totem" },
        m1screw:        { name: "Screw Attack" },
        m1varia:        { name: "Varia Suit" },
        m1wave:         { name: "Wave Beam" },

        // Progressives
        m1etank:        { name: "Energy Tank",          min: 0, max:  8 },
        m1missile:      { name: "Missiles",             min: 0, max: 20 },

        // Dungeons
        m1boss0:        { name: "Kraid Kill Credit",    min: 1, max:  2 },
        m1boss1:        { name: "Ridley Kill Credit",   min: 1, max:  2 },
        m1boss2:        { name: "Mother Brain",         min: 1, max:  2 }
    },
    regions: {  // Region defns
        m1brinstar:         ["main"],
        kraid:              ["main"],
        m1norfair:          ["main"],
        ridley:             ["main"],
        m1tourian:          ["main"],
        m1hyruleportals:    ["main"]
    },
    defaultSettings: {  // Default settings
        mapLogic:   "casualLogic",
        mPos:       "Above"
    },
    // Record dungeon completion
    dungeonBeatenInit:  Array(bosses).fill(false),
    // Record dungeon prize
    prizesInit:         Array(bosses).fill(6)
};
