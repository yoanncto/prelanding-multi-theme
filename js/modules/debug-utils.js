/**
 * Debug utilities module
 * Handles debug mode setup and console logging management
 */

const DebugUtils = {
    /**
     * Initialize debug mode based on URL parameters
     * @returns {boolean} Whether debug mode is enabled
     */
    initDebugMode: function() {
        const urlParamsDebug = new URLSearchParams(window.location.search);
        window.isDebugMode = urlParamsDebug.get('debug') === 'true';
        
        // Store original console methods
        const originalMethods = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };
        
        // Apply debug mode settings
        if (!window.isDebugMode) {
            // Suppress logs if not in debug mode
            console.log = function() {};
            console.warn = function() {};
            console.error = function() {};
        } else {
            // Use original log to show debug is active
            originalMethods.log('Debug mode enabled.');
        }
        
        // Add method to restore original console methods if needed
        this.restoreConsoleMethods = function() {
            console.log = originalMethods.log;
            console.warn = originalMethods.warn;
            console.error = originalMethods.error;
        };
        
        return window.isDebugMode;
    }
};

export default DebugUtils; 