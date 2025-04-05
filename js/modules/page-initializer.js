/**
 * Page initializer module
 * Handles main page initialization sequence
 */

import DebugUtils from './debug-utils.js';
import ParamValidator from './param-validator.js';
import DomUtils from './dom-utils.js';
import UIUtils from './ui-utils.js';
import GameLoader from './game-loader.js';

const PageInitializer = {
    /**
     * Initialize the page
     * @returns {Promise<void>}
     */
    initPage: async function() {
        try {
            console.log('Initializing page');
            
            // Wait for ThemeManager to be ready (it parses params internally now)
            await this.waitForThemeManager();
            
            // Validate required parameters
            const validationResult = ParamValidator.validateRequiredParams();
            if (!validationResult.isValid) {
                const contentDiv = document.getElementById('content');
                ParamValidator.renderParameterError(validationResult.missingParams, contentDiv);
                return; // Stop further execution
            }
            console.log('All required URL parameters are present.');
            
            const productParams = window.themeManager.productParams; // Get params from ThemeManager
            
            // Clean URL and setup base tag
            const { basePath } = UIUtils.cleanUrl();
            DomUtils.setupBaseTag(basePath);
            
            // Setup favicon
            DomUtils.setupFavicon(productParams.theme);
            
            // Setup translations
            await this.waitForTranslations();
            
            // Load game template and initialize game
            await GameLoader.loadGameAndInitialize(productParams, window.themeManager);
            
        } catch (error) {
            console.error('Critical Error initializing page:', error);
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
                contentDiv.innerHTML = '<p class="text-center text-red-600 p-8">An unexpected error occurred. Please try refreshing the page.</p>';
            }
        }
    },
    
    /**
     * Wait for ThemeManager to be ready
     * @returns {Promise<void>}
     */
    waitForThemeManager: function() {
        return new Promise(resolve => {
            const checkTM = () => {
                if (window.themeManager) {
                    console.log("ThemeManager ready.");
                    resolve();
                } else {
                    console.log("Waiting for ThemeManager...");
                    setTimeout(checkTM, 50);
                }
            };
            checkTM();
        });
    },
    
    /**
     * Wait for translations to be ready
     * @returns {Promise<void>}
     */
    waitForTranslations: function() {
        if (!window.i18n || typeof window.i18n.init !== 'function' || window.i18n.translations) {
            console.log('Translations seem ready or i18n object not configured as expected.');
            return Promise.resolve();
        }
        
        console.log('Initializing and waiting for translations...');
        return new Promise((resolve) => {
            const checkTranslations = () => {
                if (window.i18n.translations) {
                    console.log('Translations loaded.');
                    resolve();
                } else {
                    setTimeout(checkTranslations, 50);
                }
            };
            
            if (!window.i18n.isInitialized) {
                window.i18n.init().then(checkTranslations).catch(err => {
                    console.error("Translation init failed:", err);
                    resolve(); // Continue anyway
                });
            } else {
                checkTranslations();
            }
        });
    },
    
    /**
     * Initialize the application
     */
    init: function() {
        // Initialize debug mode
        DebugUtils.initDebugMode();
        console.log('Index script starting');
        
        // Initialize page on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initPage());
        } else {
            this.initPage();
        }
        
        // Expose replacePlaceholders for backwards compatibility
        window.replacePlaceholders = DomUtils.replacePlaceholders;
    }
};

export default PageInitializer; 