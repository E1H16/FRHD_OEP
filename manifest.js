// Asset load timeout: 5 minutes (300,000 ms)
var ASSET_LOAD_TIMEOUT_MS = 300000;

// Reduced timeout for offline mode: 5 seconds — fail fast for unreachable remote assets
var OFFLINE_ASSET_TIMEOUT_MS = 5000;

/**
 * Returns the appropriate asset load timeout based on connectivity.
 * When offline, assets time out quickly so the app starts faster.
 */
function getAssetTimeout() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return OFFLINE_ASSET_TIMEOUT_MS;
    }
    return ASSET_LOAD_TIMEOUT_MS;
}

var GameManifest = [
    // Scripts
    { loadTimeout: getAssetTimeout(), id: "gameScript", src: "/scripts/game.js", name: "Game Code" },

    // Control images
    { loadTimeout: getAssetTimeout(), id: "tablet_controls", src: "/images/game/controls/tablet/controls_v5.png", name: "Tablet Controls" },
    { loadTimeout: getAssetTimeout(), id: "phone_controls", src: "/images/game/controls/phone/controls_v6.png", name: "Phone Controls" },
    { loadTimeout: getAssetTimeout(), id: "pause_controls", src: "/images/game/controls/pause/pause_v2.png", name: "Pause Icon" },
    { loadTimeout: getAssetTimeout(), id: "redo_undo_controls", src: "/images/game/controls/redo_undo/redo_undo.png", name: "Redo Undo Controls" },
    { loadTimeout: getAssetTimeout(), id: "zoom_controls", src: "/images/game/controls/zoom/zoom.png", name: "Zoom Controls" },
    { loadTimeout: getAssetTimeout(), id: "fullscreen_controls", src: "/images/game/controls/fullscreen/fullscreen_v4.png", name: "Fullscreen Controls" },
    { loadTimeout: getAssetTimeout(), id: "settings_controls", src: "/images/game/controls/settings/settings_v4.png", name: "Settings Controls" },

    // UI icons
    { loadTimeout: getAssetTimeout(), id: "time_icon", src: "/images/game/icons/timer_icon.png", name: "Time Icon" },
    { loadTimeout: getAssetTimeout(), id: "targets_icon", src: "/images/game/icons/goal_icon.png", name: "Goal Icon" },
    { loadTimeout: getAssetTimeout(), id: "campaign_icons", src: "/images/game/icons/campaign_icons.png", name: "Campaign Icons" },

    // Sound effects
    { loadTimeout: getAssetTimeout(), id: "victory_sound", src: "/sounds/victory.mp3", name: "Victory Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "goal_sound", src: "/sounds/goal.mp3", name: "Star Sound", data: 5 },
    { loadTimeout: getAssetTimeout(), id: "checkpoint_sound", src: "/sounds/checkpoint.mp3", name: "Checkpoint Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "boost_sound", src: "/sounds/boost.mp3", name: "Boost Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "gravity_down_sound", src: "/sounds/gravity_down.mp3", name: "Gravity Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "slowmo_sound", src: "/sounds/slowmo.mp3", name: "Slowmo Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bomb_sound", src: "/sounds/bomb.mp3", name: "Bomb Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bike_ground", src: "/sounds/bike_ground.mp3", name: "Bike Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bike_air", src: "/sounds/bike_air_v2.mp3", name: "Bike Air Sound", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bike_fall_1", src: "/sounds/fall_v2.mp3", name: "Bike Fall Sound 1", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bike_fall_2", src: "/sounds/fall_v3.mp3", name: "Bike Fall Sound 2", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "bike_fall_3", src: "/sounds/fall_v4.mp3", name: "Bike Fall Sound 3", data: 1 },
    { loadTimeout: getAssetTimeout(), id: "helicopter", src: "/sounds/helicopter.mp3", name: "Helicopter Sounds", data: 1 }
];