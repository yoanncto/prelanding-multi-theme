const THEMES = {
    amazon: {
        box: 'themes/amazon/box.html',
        scratch: 'themes/amazon/scratch.html',
        slot: 'themes/amazon/slot.html'
    },
    shopify: {
        box: 'themes/shopify/box.html',
        scratch: '/themes/shopify/scratch.html',
        slot: '/themes/shopify/slot.html'
    },
    ebay: {
        box: 'themes/ebay/box.html',
        scratch: '/themes/ebay/scratch.html',
        slot: '/themes/ebay/slot.html'
    }
};

const DEFAULT_THEME = 'amazon';
const GAME_TYPES = ['box', 'scratch', 'slot'];

class ThemeManager {
    constructor() {
        this.currentTheme = this.getThemeFromUrl() || 'amazon';
        this.gameType = this.getGameTypeFromUrl() || 'slot';
    }

    getThemeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('theme');
    }

    getGameTypeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('game');
    }

    async loadTemplate(productParams) {
        try {
            const response = await fetch(THEMES[this.currentTheme][this.gameType]);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let template = await response.text();
            
            // Replace product placeholders in the template if they exist
            if (productParams) {
                console.log('Product params received:', productParams);
                
                // Format prices using the currency formatter
                const price = window.currencyFormatter.format(productParams.price);
                const retailPrice = window.currencyFormatter.format(productParams.retailPrice);
                
                // Prepare checkout link with px parameter if available
                let checkoutLink = productParams.checkoutLink || '#';
                if (checkoutLink !== '#' && productParams.px) {
                    const separator = checkoutLink.includes('?') ? '&' : '?';
                    checkoutLink = `${checkoutLink}${separator}px=${encodeURIComponent(productParams.px)}`;                }
                
                console.log('Template before replacement:', template.substring(0, 500)); // Show first 500 chars
                
                template = template
                    .replace(/\{PRODUCT_PRICE\}/g, price)
                    .replace(/\{PRODUCT_RETAIL_PRICE\}/g, retailPrice)
                    .replace(/\{PRODUCT_NAME\}/g, productParams.productName)
                    .replace(/\{PRODUCT_IMAGE\}/g, productParams.productImage)
                    .replace(/\{CHECKOUT_LINK\}/g, checkoutLink);
                
                console.log('Template after replacement:', template.substring(0, 500)); // Show first 500 chars
            }
            
            return template;
        } catch (error) {
            console.error('Error loading template:', error);
            return null;
        }
    }
}

window.themeManager = new ThemeManager();  