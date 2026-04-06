/**
 * Error handling utilities for FRHD Offline Editor.
 *
 * Provides safe wrappers for common failure-prone operations:
 *   - localStorage read/write (quota, disabled, private browsing)
 *   - File import (corrupt/invalid files)
 *   - Network requests (timeout, retry)
 *   - Global unhandled error capture
 *
 * Usage:
 *   ErrorHandler.safeLocalStorageSet("key", value);
 *   var data = ErrorHandler.safeLocalStorageGet("key", defaultValue);
 *   ErrorHandler.init(); // install global error listener
 */
var ErrorHandler = (function () {
    "use strict";

    var STORAGE_QUOTA_WARNING_BYTES = 4 * 1024 * 1024; // 4 MB
    var DEFAULT_NETWORK_TIMEOUT_MS = 30000; // 30 seconds
    var MAX_RETRY_ATTEMPTS = 3;

    /**
     * Display a non-blocking error message to the user.
     * Falls back to alert() if no UI container is available.
     */
    function showUserError(message) {
        if (typeof GameLogger !== "undefined") {
            GameLogger.error("[ErrorHandler] " + message);
        }

        var container = document.getElementById("error-container");
        if (container) {
            var el = document.createElement("div");
            el.className = "frhd-error-toast";
            el.textContent = message;
            container.appendChild(el);

            setTimeout(function () {
                if (el.parentNode) {el.parentNode.removeChild(el);}
            }, 6000);
        }
    }

    return {
        /**
         * Install a global window.onerror handler to catch unhandled errors.
         */
        init: function () {
            window.onerror = function (message, source, lineno, colno, error) {
                var msg = "Unexpected error: " + (message || "Unknown error");
                showUserError(msg);

                if (typeof GameLogger !== "undefined") {
                    GameLogger.error(msg, { source: source, line: lineno, col: colno, error: error });
                }

                // Return true to suppress default browser error reporting
                return true;
            };

            window.addEventListener("unhandledrejection", function (event) {
                var msg = "Unexpected error: " + (event.reason || "Unknown promise rejection");
                showUserError(msg);

                if (typeof GameLogger !== "undefined") {
                    GameLogger.error(msg, event.reason);
                }
            });
        },

        /**
         * Safely write to localStorage with quota checking.
         * @param {string} key
         * @param {*} value - Will be JSON-serialized.
         * @returns {boolean} true if write succeeded, false otherwise.
         */
        safeLocalStorageSet: function (key, value) {
            try {
                var serialized = JSON.stringify(value);

                // Warn if storage is getting full (approaching typical 5-10 MB limit)
                var totalSize = 0;
                for (var i = 0; i < localStorage.length; i++) {
                    var k = localStorage.key(i);
                    totalSize += (k.length + (localStorage.getItem(k) || "").length) * 2; // UTF-16
                }
                if (totalSize + serialized.length * 2 > STORAGE_QUOTA_WARNING_BYTES) {
                    showUserError("Storage is nearly full. Consider clearing old saved tracks.");
                }

                localStorage.setItem(key, serialized);
                return true;
            } catch (e) {
                if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
                    showUserError("Storage is full. Please clear some saved tracks to free space.");
                } else {
                    showUserError("Unable to save data. Storage may be disabled in your browser.");
                }
                return false;
            }
        },

        /**
         * Safely read from localStorage.
         * @param {string} key
         * @param {*} defaultValue - Returned if key is missing or read fails.
         * @returns {*} Parsed value or defaultValue.
         */
        safeLocalStorageGet: function (key, defaultValue) {
            try {
                var raw = localStorage.getItem(key);
                if (raw === null) {return defaultValue;}
                return JSON.parse(raw);
            } catch (e) {
                showUserError("Unable to read saved data for '" + key + "'.");
                return defaultValue;
            }
        },

        /**
         * Safely remove a key from localStorage.
         * @param {string} key
         * @returns {boolean} true if removal succeeded.
         */
        safeLocalStorageRemove: function (key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Read a user-selected file and return its text content.
         * @param {File} file - File object from an <input type="file">.
         * @param {function} onSuccess - Callback with file text content.
         * @param {function} onError - Callback with error message.
         */
        safeReadFile: function (file, onSuccess, onError) {
            if (!file) {
                onError("No file selected.");
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                try {
                    var content = e.target.result;
                    if (typeof content !== "string" || content.length === 0) {
                        onError("File is empty or unreadable.");
                        return;
                    }
                    onSuccess(content);
                } catch (err) {
                    onError("Error processing file: " + err.message);
                }
            };

            reader.onerror = function () {
                onError("Failed to read file. It may be corrupted or inaccessible.");
            };

            reader.onabort = function () {
                onError("File reading was cancelled.");
            };

            try {
                reader.readAsText(file);
            } catch (e) {
                onError("Cannot read the selected file: " + e.message);
            }
        },

        /**
         * Fetch a URL with timeout and optional retry.
         * Skips the request immediately when the browser is offline,
         * returning a clear error message instead of waiting for timeout.
         * @param {string} url
         * @param {object} [options]
         * @param {number} [options.timeout] - Timeout in ms (default 30 s).
         * @param {number} [options.retries] - Number of retries (default 3).
         * @param {function} onSuccess - Callback with response text.
         * @param {function} onError - Callback with error message.
         */
        safeFetch: function (url, options, onSuccess, onError) {
            // Fail fast when offline — no point waiting for network timeout
            if (!navigator.onLine) {
                onError("You are offline. This request requires an internet connection.");
                return;
            }

            var timeout = (options && options.timeout) || DEFAULT_NETWORK_TIMEOUT_MS;
            var retries = (options && options.retries !== undefined) ? options.retries : MAX_RETRY_ATTEMPTS;
            var attempt = 0;

            function doFetch() {
                attempt++;
                var xhr = new XMLHttpRequest();
                var timedOut = false;

                var timer = setTimeout(function () {
                    timedOut = true;
                    xhr.abort();
                    if (attempt <= retries) {
                        doFetch();
                    } else {
                        onError("Request timed out after " + retries + " attempts.");
                    }
                }, timeout);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) {return;}
                    clearTimeout(timer);
                    if (timedOut) {return;}

                    if (xhr.status >= 200 && xhr.status < 300) {
                        onSuccess(xhr.responseText);
                    } else if (attempt <= retries) {
                        doFetch();
                    } else {
                        onError("Request failed with status " + xhr.status + " after " + retries + " attempts.");
                    }
                };

                xhr.onerror = function () {
                    clearTimeout(timer);
                    if (timedOut) {return;}
                    if (attempt <= retries) {
                        doFetch();
                    } else {
                        onError("Network error after " + retries + " attempts.");
                    }
                };

                xhr.open("GET", url, true);
                xhr.send();
            }

            doFetch();
        },

        /**
         * Show a user-visible error message.
         * @param {string} message
         */
        showError: showUserError
    };
})();
