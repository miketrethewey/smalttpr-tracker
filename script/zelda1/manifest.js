// Game Slug
g = "zelda1";
// Number of bosses to manage
bosses = 8 +    // Triforce Piece Dungeons
         1;     // Death Mountain: Ganon

// Set Manifest
manifests[g] = {
    slug: g,    // Game Slug
    title: {    // Game Title
        full:   "The Legend of Zelda",
        short:  "Z1",
        crumb:  "Ancient Hyrule"
    },
    prefix: "z1",               // Game Prefix
    altGame: [ "metroid1" ],    // Alternate Game
    regionFolder: "TLoZ",       // Region Folder
    bossDefns: [                // Boss defns
        "Aquamentus",
        "Digdogger",
        "Dodongo",
        "Gleeok",
        "Gohma",
        "Manhandla"
    ],
    defaultGrid: [              // Default Itemgrid
        [
            "z1boomerang",
            "z1bomb",
            "z1bow",
            "z1woods",
            "z1silvers",
            "z1candle",
            "m1morph",
            "m1bombs"
        ],
        [
            "z1recorder",
            "z1food",
            "z1bottle",
            "z1magicalrod",
            "z1sword",
            "z1shield",
            "z1heartcontainer",
            "m1ice"
        ],
        [
            "z1raft",
            "z1book",
            "z1ring",
            "z1ladder",
            "z1magicalkey",
            "z1bracelet",
            "z1letter",
            "m1hijump"
        ],
        [
            "z1boss0",
            "z1boss1",
            "z1boss2",
            "z1boss3",
            "z1boss4",
            "z1boss5",
            "z1boss6",
            "z1boss7",
        ],
        [
            "z1boss8",
        ]
    ],
    items: {
        // Item defns
        // Toggles
        z1bracelet:         { name: "Bracelet" },
        z1book:             { name: "Book" },
        z1bow:              { name: "Bow" },
        z1food:             { name: "Food" },
        z1ladder:           { name: "Ladder" },
        z1letter:           { name: "Letter" },
        z1magicalkey:       { name: "Magical Key" },
        z1magicalrod:       { name: "Magical Rod" },
        z1raft:             { name: "Raft" },
        z1recorder:         { name: "Recorder" },
        z1silvers:          { name: "Silver Arrows" },
        z1woods:            { name: "Wood Arrows" },

        // Progressives
        z1boomerang:        { name: "Boomerang",        min: 0, max:  2 },
        z1bomb:             { name: "Bombs",            min: 0, max: 16 },
        z1bottle:           { name: "Bottle",           min: 0, max:  2 },
        z1candle:           { name: "Candle",           min: 0, max:  2 },
        z1heartcontainer:   { name: "Heart Container",  min: 0, max: 14 },
        z1ring:             { name: "Ring",             min: 0, max:  2 },
        z1shield:           { name: "Shield",           min: 0, max:  2 },
        z1sword:            { name: "Sword",            min: 0, max:  3 },

        // Dungeons
        z1boss0: {
            name: "Eagle",
            boss: "Aquamentus",
            chests: 3,
            min: 1,
            max: 2,
            second: { name: "E" }
        },
        z1boss1: {
            name: "Moon",
            boss: "Dodongo",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "A", boss: "Gleeok" }
        },
        z1boss2: {
            name: "Manji",
            boss: "Manhandla",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "L", boss: "Dodongo" }
        },
        z1boss3: {
            name: "Snake",
            boss: "Gleeok",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "D", boss: "Digdogger" }
        },
        z1boss4: {
            name: "Lizard",
            boss: "Digdogger",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "Z", boss: "Gleeok" }
        },
        z1boss5: {
            name: "Dragon",
            boss: "Gohma",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "Negative Space" }
        },
        z1boss6: {
            name: "Demon",
            boss: "Aquamentus II",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "Downward Spiral", boss: "Gleeok II" }
        },
        z1boss7: {
            name: "Lion",
            boss: "Gleeok II",
            chests: 3,
            min: 1,
            max: 2,
            second: { name: "Upward Spiral", boss: "Dodongo" }
        },
        z1boss8: {
            name: "Death Mountain",
            boss: "Ganon",
            chests: 2,
            min: 1,
            max: 2,
            second: { name: "Pig" }
        },
    },
    regions: {  // Region defns
        overworld: [
            "freehint",
            "item",
            "moneymakinggame",
            "paidhint",
            "potions",
            "road",
            "rupoor",
            "secretcaves",
            "shop",
            "takeany"
        ],
        z1dungeons: [
            "level0",
            "level1",
            "level2",
            "level3",
            "level4",
            "level5",
            "level6",
            "level7",
            "level8",
            "level9"
        ]
    },
    defaultSettings: {  // Default settings
        mapLogic:   "minorGlitches",
        mPos:       "Above"
    },
    // Record dungeon completion
    dungeonBeatenInit:  Array(bosses).fill(false),
    // Record dungeon entry medallion
    prizesInit:         Array(bosses).fill(5)
};
