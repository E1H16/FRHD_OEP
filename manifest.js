// Asset load timeout: 5 minutes (300,000 ms)
var ASSET_LOAD_TIMEOUT_MS = 300000;

var GameManifest = [
    // Scripts
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "gameScript", src: "/scripts/game.js", name: "Game Code" },

    // Control images
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "tablet_controls", src: "/images/game/controls/tablet/controls_v5.png", name: "Tablet Controls" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "phone_controls", src: "/images/game/controls/phone/controls_v6.png", name: "Phone Controls" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "pause_controls", src: "/images/game/controls/pause/pause_v2.png", name: "Pause Icon" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "redo_undo_controls", src: "/images/game/controls/redo_undo/redo_undo.png", name: "Redo Undo Controls" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "zoom_controls", src: "/images/game/controls/zoom/zoom.png", name: "Zoom Controls" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "fullscreen_controls", src: "/images/game/controls/fullscreen/fullscreen_v4.png", name: "Fullscreen Controls" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "settings_controls", src: "/images/game/controls/settings/settings_v4.png", name: "Settings Controls" },

    // UI icons
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "time_icon", src: "/images/game/icons/timer_icon.png", name: "Time Icon" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "targets_icon", src: "/images/game/icons/goal_icon.png", name: "Goal Icon" },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "campaign_icons", src: "/images/game/icons/campaign_icons.png", name: "Campaign Icons" },

    // Sound effects
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "victory_sound", src: "/sounds/victory.mp3", name: "Victory Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "goal_sound", src: "/sounds/goal.mp3", name: "Star Sound", data: 5 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "checkpoint_sound", src: "/sounds/checkpoint.mp3", name: "Checkpoint Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "boost_sound", src: "/sounds/boost.mp3", name: "Boost Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "gravity_down_sound", src: "/sounds/gravity_down.mp3", name: "Gravity Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "slowmo_sound", src: "/sounds/slowmo.mp3", name: "Slowmo Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bomb_sound", src: "/sounds/bomb.mp3", name: "Bomb Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bike_ground", src: "/sounds/bike_ground.mp3", name: "Bike Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bike_air", src: "/sounds/bike_air_v2.mp3", name: "Bike Air Sound", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bike_fall_1", src: "/sounds/fall_v2.mp3", name: "Bike Fall Sound 1", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bike_fall_2", src: "/sounds/fall_v3.mp3", name: "Bike Fall Sound 2", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "bike_fall_3", src: "/sounds/fall_v4.mp3", name: "Bike Fall Sound 3", data: 1 },
    { loadTimeout: ASSET_LOAD_TIMEOUT_MS, id: "helicopter", src: "/sounds/helicopter.mp3", name: "Helicopter Sounds", data: 1 }
];