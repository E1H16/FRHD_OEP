/**
 * Conditional logging utility for FRHD Offline Editor.
 *
 * Logs are only emitted when GameSettings.developerMode is true.
 * In production builds all log calls become no-ops, avoiding information
 * disclosure and minor performance overhead.
 *
 * Usage:
 *   GameLogger.log("message");
 *   GameLogger.warn("warning");
 *   GameLogger.error("error");
 */
/* eslint-disable no-console */
var GameLogger = (function () { // eslint-disable-line no-unused-vars
    "use strict";

    function isDevMode() {
        return typeof GameSettings !== "undefined" && GameSettings.developerMode === true;
    }

    return {
        log: function () {
            if (isDevMode()) {
                console.log.apply(console, arguments);
            }
        },
        warn: function () {
            if (isDevMode()) {
                console.warn.apply(console, arguments);
            }
        },
        error: function () {
            // Always emit errors — they indicate real problems
            console.error.apply(console, arguments);
        },
        info: function () {
            if (isDevMode()) {
                console.info.apply(console, arguments);
            }
        }
    };
})();
