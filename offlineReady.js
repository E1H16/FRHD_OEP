/**
 * Offline readiness utilities for FRHD Offline Editor.
 *
 * Provides:
 *   - Online/offline status detection with event listeners
 *   - Automatic track auto-save to localStorage for crash/offline recovery
 *   - Asset availability checking before the game engine loads
 *   - Graceful fallback when network resources are unavailable
 *
 * Usage:
 *   OfflineReady.init();                       // call on app startup
 *   OfflineReady.isOnline();                    // check connectivity
 *   OfflineReady.autoSaveTrack(trackCode);      // save work-in-progress
 *   OfflineReady.loadAutoSavedTrack();           // recover after crash
 */
var OfflineReady = (function () {
    "use strict";

    var AUTO_SAVE_KEY = "frhd_autosave_track";
    var AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds
    var _autoSaveTimer = null;
    var _lastSavedCode = "";
    var _statusListeners = [];

    /**
     * Show a non-blocking status message to the user.
     * @param {string} message
     * @param {string} type - "info" or "warning"
     */
    function showStatus(message, type) {
        if (typeof GameLogger !== "undefined") {
            if (type === "warning") {
                GameLogger.warn("[OfflineReady] " + message);
            } else {
                GameLogger.log("[OfflineReady] " + message);
            }
        }

        var container = document.getElementById("error-container");
        if (container) {
            var el = document.createElement("div");
            el.className = type === "warning" ? "frhd-error-toast" : "frhd-info-toast";
            el.textContent = message;
            container.appendChild(el);

            setTimeout(function () {
                if (el.parentNode) { el.parentNode.removeChild(el); }
            }, 4000);
        }
    }

    /**
     * Notify all registered status listeners of connectivity change.
     * @param {boolean} online
     */
    function notifyListeners(online) {
        for (var i = 0; i < _statusListeners.length; i++) {
            try {
                _statusListeners[i](online);
            } catch (e) {
                // Ignore listener errors
            }
        }
    }

    /**
     * Check if a local asset file is reachable via a HEAD request.
     * @param {string} path - Relative asset path (e.g., "/scripts/game.js")
     * @param {function} callback - Called with true/false
     */
    function checkAssetAvailable(path, callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", path, true);
            xhr.timeout = 5000;

            xhr.onload = function () {
                callback(xhr.status >= 200 && xhr.status < 400);
            };
            xhr.onerror = function () {
                callback(false);
            };
            xhr.ontimeout = function () {
                callback(false);
            };

            xhr.send();
        } catch (e) {
            callback(false);
        }
    }

    /**
     * Store a value safely in localStorage.
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function safeStore(key, value) {
        if (typeof ErrorHandler !== "undefined") {
            return ErrorHandler.safeLocalStorageSet(key, value);
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Read a value safely from localStorage.
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    function safeRead(key, defaultValue) {
        if (typeof ErrorHandler !== "undefined") {
            return ErrorHandler.safeLocalStorageGet(key, defaultValue);
        }
        try {
            var raw = localStorage.getItem(key);
            if (raw === null) { return defaultValue; }
            return JSON.parse(raw);
        } catch (e) {
            return defaultValue;
        }
    }

    return {
        /**
         * Initialize offline readiness features.
         * Installs online/offline event listeners and starts auto-save.
         */
        init: function () {
            var self = this;

            // Listen for browser online/offline events
            window.addEventListener("online", function () {
                showStatus("Connection restored. You are back online.", "info");
                notifyListeners(true);
            });

            window.addEventListener("offline", function () {
                showStatus("You are offline. Your work is saved locally.", "warning");
                notifyListeners(false);

                // Force an immediate auto-save when going offline
                self.triggerAutoSave();
            });

            // Log initial status
            if (!navigator.onLine) {
                showStatus("Starting in offline mode. All features work locally.", "info");
            }
        },

        /**
         * Check if the browser currently reports being online.
         * @returns {boolean}
         */
        isOnline: function () {
            return navigator.onLine;
        },

        /**
         * Register a callback for connectivity changes.
         * @param {function} listener - Called with (isOnline: boolean)
         */
        onStatusChange: function (listener) {
            if (typeof listener === "function") {
                _statusListeners.push(listener);
            }
        },

        /**
         * Auto-save track code to localStorage periodically.
         * Only writes when the code has actually changed.
         * @param {function} getTrackCodeFn - Function that returns current track code string
         */
        startAutoSave: function (getTrackCodeFn) {
            if (typeof getTrackCodeFn !== "function") { return; }

            // Clear any previous timer
            if (_autoSaveTimer) {
                clearInterval(_autoSaveTimer);
            }

            _autoSaveTimer = setInterval(function () {
                try {
                    var code = getTrackCodeFn();
                    if (typeof code === "string" && code.length > 0 && code !== _lastSavedCode) {
                        safeStore(AUTO_SAVE_KEY, {
                            code: code,
                            timestamp: Date.now()
                        });
                        _lastSavedCode = code;
                    }
                } catch (e) {
                    // Silently fail — auto-save is best-effort
                }
            }, AUTO_SAVE_INTERVAL_MS);
        },

        /**
         * Stop the auto-save timer.
         */
        stopAutoSave: function () {
            if (_autoSaveTimer) {
                clearInterval(_autoSaveTimer);
                _autoSaveTimer = null;
            }
        },

        /**
         * Immediately save the current track code.
         * Call this before navigating away or on offline event.
         */
        triggerAutoSave: function () {
            // Dispatch a custom event that the editor can listen for
            try {
                var event = new CustomEvent("frhd-autosave-request");
                window.dispatchEvent(event);
            } catch (e) {
                // CustomEvent not supported in very old browsers
            }
        },

        /**
         * Save track code directly (for manual saves).
         * @param {string} trackCode
         * @returns {boolean} true if saved successfully
         */
        autoSaveTrack: function (trackCode) {
            if (typeof trackCode !== "string" || trackCode.length === 0) {
                return false;
            }
            _lastSavedCode = trackCode;
            return safeStore(AUTO_SAVE_KEY, {
                code: trackCode,
                timestamp: Date.now()
            });
        },

        /**
         * Load the last auto-saved track code, if any.
         * @returns {{ code: string, timestamp: number } | null}
         */
        loadAutoSavedTrack: function () {
            var data = safeRead(AUTO_SAVE_KEY, null);
            if (data && typeof data.code === "string" && data.code.length > 0) {
                return data;
            }
            return null;
        },

        /**
         * Clear the auto-saved track data.
         */
        clearAutoSave: function () {
            _lastSavedCode = "";
            if (typeof ErrorHandler !== "undefined") {
                ErrorHandler.safeLocalStorageRemove(AUTO_SAVE_KEY);
            } else {
                try {
                    localStorage.removeItem(AUTO_SAVE_KEY);
                } catch (e) {
                    // Ignore
                }
            }
        },

        /**
         * Check if essential assets are available locally.
         * Useful on startup to warn the user if files are missing.
         * @param {function} callback - Called with { available: boolean, missing: string[] }
         */
        checkEssentialAssets: function (callback) {
            if (typeof GameManifest === "undefined" || !Array.isArray(GameManifest)) {
                callback({ available: true, missing: [] });
                return;
            }

            var missing = [];
            var checked = 0;
            // Only check the game script and control images (first 8 items)
            var essentialCount = Math.min(GameManifest.length, 8);

            if (essentialCount === 0) {
                callback({ available: true, missing: [] });
                return;
            }

            for (var i = 0; i < essentialCount; i++) {
                (function (asset) {
                    checkAssetAvailable(asset.src, function (ok) {
                        if (!ok) {
                            missing.push(asset.name || asset.id);
                        }
                        checked++;
                        if (checked === essentialCount) {
                            callback({
                                available: missing.length === 0,
                                missing: missing
                            });
                        }
                    });
                })(GameManifest[i]);
            }
        },

        /**
         * Save track code before the page unloads (beforeunload safety net).
         * @param {function} getTrackCodeFn - Function that returns current track code string
         */
        installBeforeUnloadSave: function (getTrackCodeFn) {
            if (typeof getTrackCodeFn !== "function") { return; }

            window.addEventListener("beforeunload", function () {
                try {
                    var code = getTrackCodeFn();
                    if (typeof code === "string" && code.length > 0) {
                        // Use synchronous localStorage write for beforeunload reliability
                        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({
                            code: code,
                            timestamp: Date.now()
                        }));
                    }
                } catch (e) {
                    // Best-effort
                }
            });
        }
    };
})();
