const THEMES = {
    amazon: {
        box: 'themes/amazon/box.html',
        scratch: 'themes/amazon/scratch.html',
        slot: 'themes/amazon/slot.html',
        checkout: 'themes/amazon/checkout.html'
    },
    shopify: {
        box: 'themes/shopify/box.html',
        scratch: 'themes/shopify/scratch.html',
        slot: 'themes/shopify/slot.html',
        checkout: 'themes/shopify/checkout.html'
    },
    ebay: {
        box: 'themes/ebay/box.html',
        scratch: 'themes/ebay/scratch.html',
        slot: 'themes/ebay/slot.html',
        checkout: 'themes/ebay/checkout.html'
    }
};

const DEFAULT_THEME = 'amazon';
const GAME_TYPES = ['box', 'scratch', 'slot'];
const CHECKOUT_TYPE = 'checkout';

class ThemeManager {
    constructor() {
        this.productParams = this.getUrlParameters();
        this.currentTheme = this.productParams.theme || DEFAULT_THEME;
        this.currentGameType = this.productParams.game;
        console.log('ThemeManager initialized with params:', this.productParams);
    }

    getUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        const checkoutLink = decodeURIComponent(params.get('checkoutLink') || '#');

        return {
            price: params.get('price'),
            retailPrice: params.get('retailPrice'),
            productName: params.get('productName'),
            productImage: params.get('productImage'),
            theme: params.get('theme') || DEFAULT_THEME,
            game: params.get('game'),
            checkoutLink: checkoutLink,
            px: params.get('px') || '',
            subid: params.get('subid') || '',
            token: params.get('token') || ''
        };
    }

    async loadGameTemplate() {
        const theme = this.currentTheme;
        const game = this.currentGameType;

        if (!theme || !game || !THEMES[theme] || !THEMES[theme][game]) {
            console.error(`Invalid theme (${theme}) or game (${game}) specified.`);
            const fallbackTheme = THEMES[theme] ? theme : DEFAULT_THEME;
            const fallbackGame = GAME_TYPES[0];
            console.log(`Attempting fallback to: ${fallbackTheme}/${fallbackGame}`);
            this.currentTheme = fallbackTheme;
            this.currentGameType = fallbackGame;
             if (!THEMES[this.currentTheme] || !THEMES[this.currentTheme][this.currentGameType]) {
                 console.error("Fallback theme/game also invalid. Cannot load template.");
                 return null;
             }
        }

        const templateUrl = THEMES[this.currentTheme][this.currentGameType];
        console.log(`Loading game template: ${templateUrl}`);
        return this._fetchAndProcessTemplate(templateUrl, this.productParams);
    }

    async loadCheckoutTemplate() {
        const theme = this.currentTheme;
         if (!theme || !THEMES[theme] || !THEMES[theme][CHECKOUT_TYPE]) {
             console.error(`Invalid theme (${theme}) or missing checkout template definition.`);
             const fallbackTheme = THEMES[theme] ? theme : DEFAULT_THEME;
              if (!THEMES[fallbackTheme] || !THEMES[fallbackTheme][CHECKOUT_TYPE]) {
                  console.error("Fallback theme checkout also invalid. Cannot load checkout template.");
                  return null;
              }
              this.currentTheme = fallbackTheme;
         }

        const templateUrl = THEMES[this.currentTheme][CHECKOUT_TYPE];
        console.log(`Loading checkout template: ${templateUrl}`);
        return this._fetchAndProcessTemplate(templateUrl, this.productParams);
    }

    async _fetchAndProcessTemplate(templateUrl, params) {
        try {
            const response = await fetch(templateUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${templateUrl}`);
            }
            let template = await response.text();

            if (typeof window.replacePlaceholders === 'function') {
                 const tempDiv = document.createElement('div');
                 tempDiv.innerHTML = template;
                 window.replacePlaceholders(params, tempDiv);
                 template = tempDiv.innerHTML;
                 console.log(`Placeholders processed for ${templateUrl}`);
            } else {
                 console.warn(`window.replacePlaceholders function not found. Placeholders in ${templateUrl} might not be replaced.`);
                 const price = window.currencyFormatter?.format(params.price) || params.price;
                 const retailPrice = window.currencyFormatter?.format(params.retailPrice) || params.retailPrice;
                 let checkoutLink = params.checkoutLink || '#';
                 if (checkoutLink !== '#' && params.px) {
                    const separator = checkoutLink.includes('?') ? '&' : '?';
                    checkoutLink = `${checkoutLink}${separator}px=${encodeURIComponent(params.px)}`;
                 }
                 template = template
                    .replace(/\{PRODUCT_PRICE\}/g, price)
                    .replace(/\{PRODUCT_RETAIL_PRICE\}/g, retailPrice)
                    .replace(/\{PRODUCT_NAME\}/g, params.productName)
                    .replace(/\{PRODUCT_IMAGE\}/g, params.productImage)
                    .replace(/\{CHECKOUT_LINK\}/g, checkoutLink)
                    .replace(/\{CLICKID\}/g, params.subid)
                    .replace(/\{TOKEN\}/g, params.token);


            }

            return template;
        } catch (error) {
            console.error(`Error loading or processing template ${templateUrl}:`, error);
            return null;
        }
    }
}

if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', () => {
         window.themeManager = new ThemeManager();
         console.log("ThemeManager instantiated on DOMContentLoaded");
     });
} else {
     window.themeManager = new ThemeManager();
     console.log("ThemeManager instantiated immediately");
}

window.loadCheckoutPage = async function() {
    console.log("loadCheckoutPage called");
    if (!window.themeManager) {
        console.error("ThemeManager not available.");
        return;
    }

    try {
        const checkoutTemplate = await window.themeManager.loadCheckoutTemplate();
        if (checkoutTemplate) {
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
                contentDiv.innerHTML = checkoutTemplate;
                console.log("Checkout template loaded into #content");

                if (typeof window.initializeCheckoutForm === 'function') {
                    window.initializeCheckoutForm(window.themeManager.productParams);
                } else {
                    console.warn("initializeCheckoutForm function not found in checkout-handler.js");
                }

                if (window.i18n && typeof window.i18n.updatePageTranslations === 'function') {
                     console.log('Applying translations to checkout content');
                     window.i18n.updatePageTranslations(contentDiv);
                 }

            } else {
                console.error("Content container (#content) not found!");
            }
        } else {
            console.error("Failed to load checkout template.");
             const contentDiv = document.getElementById('content');
             if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-600 p-8">Error loading checkout form. Please try refreshing.</p>';
        }
    } catch (error) {
        console.error("Error during loadCheckoutPage:", error);
         const contentDiv = document.getElementById('content');
         if(contentDiv) contentDiv.innerHTML = '<p class="text-center text-red-600 p-8">An error occurred loading the checkout page.</p>';
    }
};  