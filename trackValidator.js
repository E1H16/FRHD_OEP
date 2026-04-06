/**
 * Track code validator for FRHD Offline Editor.
 *
 * Validates imported track code before it is processed by the game engine.
 * This prevents malformed or malicious data from crashing the application
 * or exploiting the track parser.
 *
 * Track code format (FRHD v1):
 *   - Sections separated by "#"
 *   - Coordinates within sections separated by ","
 *   - Point pairs separated by " " (space)
 *   - Valid characters: digits 0-9, minus sign "-", separators ",", " ", "#"
 *
 * Usage:
 *   var result = TrackValidator.validate(trackCode);
 *   if (!result.valid) {
 *       alert("Invalid track code: " + result.error);
 *   }
 */
var TrackValidator = (function () {
    "use strict";

    // Maximum allowed track code length (10 MB of text)
    var MAX_TRACK_CODE_LENGTH = 10 * 1024 * 1024;

    // Maximum number of coordinate points allowed per section
    var MAX_POINTS_PER_SECTION = 500000;

    // Maximum number of sections allowed
    var MAX_SECTIONS = 20;

    // Only allow safe characters: digits, minus, comma, space, hash, newline
    var SAFE_CHARS_REGEX = /^[\d\s,\-#\n\r]*$/;

    // A coordinate value must be a finite number
    function isValidCoordinate(value) {
        // Empty strings and lone minus signs are not valid numbers
        if (value === "" || value === "-") {
            return false;
        }
        var num = Number(value);
        return Number.isFinite(num) && Math.abs(num) < 1e9;
    }

    function validateSection(section, sectionIndex) {
        if (section === "") {return null;} // Empty sections are allowed (no data)

        var pairs = section.split(",");
        if (pairs.length > MAX_POINTS_PER_SECTION) {
            return "Section " + sectionIndex + " exceeds maximum point count (" + MAX_POINTS_PER_SECTION + ")";
        }

        for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].trim().split(" ");
            // Each pair should have an even number of coordinate values (x y pairs)
            for (var j = 0; j < parts.length; j++) {
                var val = parts[j].trim();
                if (val === "") {continue;} // skip whitespace
                if (!isValidCoordinate(val)) {
                    return "Invalid coordinate '" + val.substring(0, 20) + "' in section " + sectionIndex;
                }
            }
        }

        return null; // Valid
    }

    return {
        /**
         * Validate a track code string.
         * @param {string} trackCode - The raw track code to validate.
         * @returns {{ valid: boolean, error?: string }} Validation result.
         */
        validate: function (trackCode) {
            // Type check
            if (typeof trackCode !== "string") {
                return { valid: false, error: "Track code must be a string" };
            }

            // Length check
            if (trackCode.length === 0) {
                return { valid: false, error: "Track code is empty" };
            }
            if (trackCode.length > MAX_TRACK_CODE_LENGTH) {
                return { valid: false, error: "Track code exceeds maximum length (" + MAX_TRACK_CODE_LENGTH + " characters)" };
            }

            // Character whitelist check (prevents code injection)
            if (!SAFE_CHARS_REGEX.test(trackCode)) {
                return { valid: false, error: "Track code contains invalid characters. Only digits, commas, spaces, hyphens, and '#' are allowed." };
            }

            // Section count check
            var sections = trackCode.split("#");
            if (sections.length > MAX_SECTIONS) {
                return { valid: false, error: "Track code has too many sections (max " + MAX_SECTIONS + ")" };
            }

            // Validate each section
            for (var i = 0; i < sections.length; i++) {
                var err = validateSection(sections[i], i);
                if (err !== null) {
                    return { valid: false, error: err };
                }
            }

            return { valid: true };
        },

        /**
         * Sanitize a track code string by removing all invalid characters.
         * @param {string} trackCode - The raw track code.
         * @returns {string} Sanitized track code.
         */
        sanitize: function (trackCode) {
            if (typeof trackCode !== "string") {return "";}
            return trackCode.replace(/[^\d\s,\-#\n\r]/g, "");
        }
    };
})();
