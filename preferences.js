/**
 * User preference persistence for FRHD Offline Editor.
 *
 * Remembers the user's last-used vehicle, tool, and other settings
 * across sessions using localStorage.
 *
 * Usage:
 *   UserPreferences.load();            // call on app startup
 *   UserPreferences.setVehicle("BMX"); // save vehicle preference
 *   UserPreferences.setTool("brush");  // save tool preference
 */
var UserPreferences = (function () {
    "use strict";

    var STORAGE_KEY = "frhd_user_preferences";

    var defaults = {
        vehicle: "MTB",
        tool: "straightline",
        lowQualityMode: false,
        soundsEnabled: true,
        gridEnabled: false,
        snapEnabled: false,
        autoSaveEnabled: true
    };

    var current = {};

    function mergeDefaults(saved) {
        var result = {};
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                result[key] = (saved && saved.hasOwnProperty(key)) ? saved[key] : defaults[key];
            }
        }
        return result;
    }

    function persist() {
        if (typeof ErrorHandler !== "undefined") {
            ErrorHandler.safeLocalStorageSet(STORAGE_KEY, current);
        } else {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
            } catch (e) {
                // Silently fail if storage is unavailable
            }
        }
    }

    return {
        /**
         * Load saved preferences from localStorage and apply to GameSettings.
         * Call this on application startup after settings.js is loaded.
         */
        load: function () {
            var saved = null;
            if (typeof ErrorHandler !== "undefined") {
                saved = ErrorHandler.safeLocalStorageGet(STORAGE_KEY, null);
            } else {
                try {
                    var raw = localStorage.getItem(STORAGE_KEY);
                    if (raw) {saved = JSON.parse(raw);}
                } catch (e) {
                    // Ignore
                }
            }

            current = mergeDefaults(saved);

            // Apply to GameSettings if available
            if (typeof GameSettings !== "undefined") {
                GameSettings.startVehicle = current.vehicle;
                GameSettings.startTool = current.tool;
                GameSettings.lowQualityMode = current.lowQualityMode;
                GameSettings.soundsEnabled = current.soundsEnabled;
                GameSettings.autoSaveEnabled = current.autoSaveEnabled;

                if (GameSettings.toolHandler) {
                    GameSettings.toolHandler.grid = current.gridEnabled;
                    GameSettings.toolHandler.snap = current.snapEnabled;
                }
            }
        },

        /**
         * Get the current value of a preference.
         * @param {string} key
         * @returns {*}
         */
        get: function (key) {
            return current.hasOwnProperty(key) ? current[key] : defaults[key];
        },

        /**
         * Save the last-used vehicle.
         * @param {string} vehicle - e.g. "MTB", "BMX"
         */
        setVehicle: function (vehicle) {
            current.vehicle = vehicle;
            persist();
        },

        /**
         * Save the last-used editor tool.
         * @param {string} tool - e.g. "straightline", "brush", "curve"
         */
        setTool: function (tool) {
            current.tool = tool;
            persist();
        },

        /**
         * Save a generic preference.
         * @param {string} key
         * @param {*} value
         */
        set: function (key, value) {
            if (defaults.hasOwnProperty(key)) {
                current[key] = value;
                persist();
            }
        },

        /**
         * Reset all preferences to defaults.
         */
        reset: function () {
            current = mergeDefaults(null);
            persist();
        }
    };
})();
