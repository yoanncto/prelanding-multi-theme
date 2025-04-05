/**
 * Parameter validator module
 * Provides URL parameter validation functionality
 */

const ParamValidator = {
    /**
     * Required parameters for the application
     */
    requiredParams: ['price', 'productName', 'productImage',
       'retailPrice', 'checkoutLink','theme','game'],
    
    /**
     * Validate that all required URL parameters are present
     * @returns {Object} Validation result with status and missing parameters if any
     */
    validateRequiredParams: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const missingParams = this.requiredParams.filter(param => !urlParams.has(param));
        
        return {
            isValid: missingParams.length === 0,
            missingParams: missingParams
        };
    },
    
    /**
     * Render an error message when required parameters are missing
     * @param {Array} missingParams - Array of missing parameter names
     * @param {HTMLElement} contentDiv - The content div to insert error message
     */
    renderParameterError: function(missingParams, contentDiv) {
        console.error('Missing required URL parameters:', missingParams.join(', '));
        
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
                        <p class="text-gray-700">This page requires specific information to load correctly.</p>
                        <p class="text-gray-700 mt-4">Please check the link you used or contact support.</p>
                    </div>
                </div>
            `;
        }
    }
};

export default ParamValidator; 