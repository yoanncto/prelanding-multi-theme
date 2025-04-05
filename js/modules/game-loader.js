/**
 * Game loader module
 * Handles loading and initialization of game-specific scripts
 */

import UIUtils from './ui-utils.js';

const GameLoader = {
    /**
     * Initialize game-specific scripts
     * @param {string} gameType - Type of game to initialize
     * @param {Object} params - Game parameters 
     */
    initializeGameScripts: function(gameType, params) {
        if (!gameType) {
            console.warn("No game type specified, cannot initialize game scripts.");
            // Potentially load a default display or error message
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
                UIUtils.showMessage("No game selected.", contentDiv, 'warning');
            }
            return;
        }

        // Clean up any existing game scripts
        document.querySelectorAll('script[data-game-script]').forEach(script => script.remove());

        // Create and append the new script
        const script = document.createElement('script');
        script.src = `js/games/${gameType}.js`;
        script.setAttribute('data-game-script', 'true');
        script.defer = true;

        script.onload = () => {
            console.log(`${gameType}.js loaded.`);
            if (typeof window.initializeGame === 'function') {
                console.log(`Calling initializeGame() for ${gameType}.js`);
                try {
                    window.initializeGame(params);
                    // NOTE: The final checkout button listener setup is removed from here.
                    // It should be triggered by the game logic itself when the result section is shown,
                    // OR handled within the window.loadCheckoutPage function implicitly.
                    // The crucial part is that the button in the template calls window.loadCheckoutPage().
                } catch (error) {
                    console.error(`Error during initializeGame for ${gameType}:`, error);
                }
            } else {
                console.warn(`initializeGame function not found in ${gameType}.js`);
            }
        };

        script.onerror = (e) => {
            console.error(`Failed to load game script: ${script.src}`, e);
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
                UIUtils.showMessage("Error loading game components.", contentDiv, 'error');
            }
        };

        document.body.appendChild(script);
        return script;
    },

    /**
     * Load game template and initialize game
     * @param {Object} productParams - Product parameters including game type
     * @param {function} themeManager - Theme manager with loadGameTemplate method
     * @returns {Promise<void>}
     */
    loadGameAndInitialize: async function(productParams, themeManager) {
        try {
            const template = await themeManager.loadGameTemplate();
            const contentDiv = document.getElementById('content');

            if (template && contentDiv) {
                console.log('Initial game template loaded, length:', template.length);
                contentDiv.innerHTML = template;
                console.log('Initial game template inserted into DOM');

                // Initialize game-specific scripts AFTER template insertion
                this.initializeGameScripts(productParams.game, productParams);
                console.log('Game scripts initialization requested for:', productParams.game);

                // Apply translations
                if (window.i18n && typeof window.i18n.updatePageTranslations === 'function') {
                    console.log('Applying translations to initial content');
                    window.i18n.updatePageTranslations(contentDiv);
                    UIUtils.updatePageTitle(productParams);
                }
            } else {
                console.error('Initial game template failed to load or #content not found');
                if (contentDiv) {
                    UIUtils.showMessage("Error loading content. Please try refreshing the page.", contentDiv, 'error');
                }
            }
        } catch (error) {
            console.error('Error loading game:', error);
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
                UIUtils.showMessage("An unexpected error occurred. Please try refreshing the page.", contentDiv, 'error');
            }
        }
    }
};

export default GameLoader; 