g = "metroid3";
bosses = 5 +    // 5 Mini (BT, SpoSpo, Croc, Botwoon, GT)
         4 +    // 4 G4
         1;     // 1 Mother Brain
manifests[g] = {
    slug: g,
    title: {
        full:   "Super Metroid",
        short:  "M3",
        crumb:  "Planet Zebes"
    },
    prefix: "m3",
    altGame: [ "zelda3" ],
    regionFolder: "SuperMetroid",
    defaultGrid: [
        [
            "m3missile",
            "m3supermissile",
            "m3powerbomb",
            "m3grappling",
            "m3xray",
            "z3hookshot",
            "z3lantern",
        ],
        [
            "m3charge",
            "m3ice",
            "m3wave",
            "m3spazer",
            "m3plasma",
            "z3hammer",
            "z3flute",
        ],
        [
            "m3varia",
            "m3morph",
            "m3bombs",
            "m3space",
            "m3hijump",
            "z3mirror",
            "z3agahnim",
        ],
        [
            "m3gravity",
            "m3springball",
            "m3screw",
            "m3speed",
            "m3etank",
            "z3boots",
            "z3glove",
        ],
        [
            "m3boss2",
            "m3boss4",
            "m3boss6",
            "m3boss8",
            "m3rtank",
            "z3flippers",
            "z3moonpearl",
        ]
    ],
    items: {
        m3bombs:        { name: "Bombs" },
        m3charge:       { name: "Charge Beam" },
        m3grappling:    { name: "Grapple Beam" },
        m3gravity:      { name: "Gravity Suit" },
        m3hijump:       { name: "Hi-Jump Boots" },
        m3ice:          { name: "Ice Beam" },
        m3morph:        { name: "Morph Ball" },
        m3plasma:       { name: "Plasma Beam" },
        m3screw:        { name: "Screw Attack" },
        m3space:        { name: "Space Jump" },
        m3spazer:       { name: "Spazer Beam" },
        m3speed:        { name: "Speed Booster" },
        m3springball:   { name: "Spring Ball" },
        m3varia:        { name: "Varia Suit" },
        m3wave:         { name: "Wave Beam" },
        m3xray:         { name: "X-Ray Scope" },
        m3etank:        { name: "Energy Tank",      min: 0, max: 14 },
        m3rtank:        { name: "Reserve Tank",     min: 0, max:  4},
        m3missile:      { name: "Missiles",         min: 0, max: 40 },
        m3powerbomb:    { name: "Power Bomb",       min: 0, max: 10 },
        m3supermissile: { name: "Super Missile",    min: 0, max: 16 },

        m3kraid:        { name: "Kraid Kill Credit" },
        m3phantoon:     { name: "Phantoon Kill Credit" },
        m3draygon:      { name: "Draygon Kill Credit" },
        m3ridley:       { name: "Ridley Kill Credit" },

        m3boss0:        {
            name: "Bomb Torizo Kill Credit",
            chests: 0,
            min: 1,
            max: 2
        },
        m3boss1:        { name: "Spore Spawn Kill Credit",  chests: 0, min: 1, max: 2 },
        m3boss2:        { name: "Kraid Kill Credit",        chests: 0, min: 1, max: 2 },
        m3boss3:        { name: "Crocomire Kill Credit",    chests: 0, min: 1, max: 2 },
        m3boss4:        { name: "Phantoon Kill Credit",     chests: 0, min: 1, max: 2 },
        m3boss5:        { name: "Botwoon Kill Credit",      chests: 0, min: 1, max: 2 },
        m3boss6:        { name: "Draygon Kill Credit",      chests: 0, min: 1, max: 2 },
        m3boss7:        { name: "Gold Torizo Kill Credit",  chests: 0, min: 1, max: 2 },
        m3boss8:        { name: "Ridley Kill Credit",       chests: 0, min: 1, max: 2 },
        m3boss9:        { name: "Mother Brain Kill Credit", chests: 0, min: 1, max: 2 }
    },
    regions: {
        crateria: [
            "central",
            "east",
            "west"
        ],
        m3brinstar: [
            "blue",
            "green",
            "pink",
            "red",
            "kraid"
        ],
        m3norfair: [
            "crocomire",
            "east",
            "west"
        ],
        wreckedship:    ["main"],
        maridia: [
            "inner",
            "outer"
        ],
        lowernorfair: [
            "west",
            "east"
        ],
        m3tourian:          ["main"],
        m3hyruleportals:    ["main"],
    },
    defaultSettings: {
        chestSkin:  "lights",
        mapLogic:   "casualLogic",
        mPos:       "Above",
        mZoom:      100,
        showPrizes: true
    },
    dungeonBeatenInit:  Array(bosses).fill(false),
    prizesInit:         Array(bosses).fill(4)
};
