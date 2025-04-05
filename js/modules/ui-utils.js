/**
 * UI utilities module
 * Handles UI-related functionality such as page title updates
 */

const UIUtils = {
    /**
     * Update the page title based on theme and game parameters
     * @param {Object} params - Parameters containing theme and game info
     */
    updatePageTitle: function(params) {
        const titleElement = document.querySelector('head title');
        if (titleElement) {
            const themeName = params.theme.charAt(0).toUpperCase() + params.theme.slice(1);
            // Use game name if available, otherwise just theme name
            const gameName = params.game ? params.game.charAt(0).toUpperCase() + params.game.slice(1) : '';
            const titleKey = `page_title.${params.theme}${params.game ? '.' + params.game : ''}`; // e.g., page_title.amazon.slot
            const defaultTitle = `${themeName}${gameName ? ' ' + gameName : ''} Offer`;
            titleElement.textContent = window.i18n?.getTranslation(titleKey) || defaultTitle;
            console.log("Page title updated to:", titleElement.textContent);
            return titleElement.textContent;
        }
        return null;
    },

    /**
     * Display an error message in the content area
     * @param {string} message - Error message to display
     * @param {HTMLElement} contentDiv - Content element to insert the message
     * @param {string} severity - Severity level (error, warning, info)
     */
    showMessage: function(message, contentDiv, severity = 'error') {
        if (!contentDiv) return;
        
        const colorClass = {
            'error': 'text-red-600',
            'warning': 'text-yellow-600',
            'info': 'text-blue-600'
        }[severity] || 'text-red-600';
        
        contentDiv.innerHTML += `<p class="text-center ${colorClass} p-4">${message}</p>`;
    },
    
    /**
     * Clean URL by removing unnecessary query parameters and setting proper base path
     * @returns {Object} with basePath and cleanPath
     */
    cleanUrl: function() {
        const currentUrl = new URL(window.location.href);
        const originalPath = currentUrl.pathname;
        const basePath = originalPath.substring(0, originalPath.lastIndexOf('/') + 1);
        const cleanPath = basePath.endsWith('/') && basePath.length > 1 ? basePath : '/';

        window.history.replaceState(
            { basePath: basePath },
            document.title,
            currentUrl.origin + (cleanPath === '/' ? '' : cleanPath)
        );
        console.log(`URL cleaned. Base path kept: ${basePath}`);
        
        return { 
            basePath: basePath, 
            cleanPath: cleanPath
        };
    }
};

export default UIUtils; 