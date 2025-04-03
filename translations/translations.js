// Translations manager
class TranslationManager {
    constructor() {
        this.translations = null;
        this.currentLang = this.getLanguage();
        this.observer = null;
        this.init();
        this.setupObserver();
        this.dynamicElements = ['productName', 'productPrice', 'productRetailPrice', 'resultProductName', 'resultProductPrice'];
    }

    getLanguage() {
        // First check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) return urlLang;

        // Get browser languages
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
        
        // Map of supported languages and their variants
        const supportedLangs = {
            'en': ['en', 'en-US', 'en-GB'],
            'de': ['de', 'de-DE', 'de-AT', 'de-CH'],
            'fr': ['fr', 'fr-FR', 'fr-BE', 'fr-CH', 'fr-LU'],
            'fi': ['fi', 'fi-FI'],
            'nl': ['nl', 'nl-NL', 'nl-BE'],
            'es': ['es', 'es-ES'],
            'it': ['it', 'it-IT'],
            'gr': ['el', 'el-GR'],
            'hu': ['hu', 'hu-HU'],
            'ee': ['et', 'et-EE'],
            'no': ['nb', 'nb-NO', 'nn-NO', 'no'],
            'se': ['sv', 'sv-SE'],
            'at': ['de-AT'],
            'ch-de': ['de-CH'],
            'ch-fr': ['fr-CH'],
            'be-nl': ['nl-BE'],
            'be-fr': ['fr-BE'],
            'lu-de': ['de-LU'],
            'lu-fr': ['fr-LU'],
            'gb': ['en-GB']
        };

        // Try to find a matching language
        for (const browserLang of browserLangs) {
            const langCode = browserLang.toLowerCase();
            
            // First try exact match
            if (supportedLangs[langCode]) {
                return langCode;
            }

            // Then try to match language variants
            for (const [code, variants] of Object.entries(supportedLangs)) {
                if (variants.some(variant => langCode === variant.toLowerCase() || 
                                         langCode.startsWith(variant.toLowerCase() + '-'))) {
                    return code;
                }
            }
        }

        // Fallback to English if no match found
        return 'en';
    }

    async init() {
        try {
            const response = await fetch(`translations/${this.currentLang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            this.updatePageTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English if there's an error
            if (this.currentLang !== 'en') {
                this.currentLang = 'en';
                this.init();
            }
        }
    }

    setupObserver() {
        // Create a MutationObserver to watch for DOM changes
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    this.updatePageTranslations();
                }
            });
        });

        // Start observing once the DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (document.body) {
                    this.observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        } else {
            if (document.body) {
                this.observer.observe(document.body, { childList: true, subtree: true });
            }
        }
    }

    getTranslation(key, params = null) {
        if (!this.translations) return key;

        const value = key.split('.').reduce((obj, i) => obj?.[i], this.translations);
        if (!value) return key;

        if (params) {
            return Object.entries(params).reduce((text, [key, val]) => 
                text.replace(new RegExp(`\\{${key}\\}`, 'g'), val), value);
        }

        return value;
    }

    updatePageTranslations() {
        if (!this.translations) return;

        // Skip translation for dynamic elements
        document.querySelectorAll('[data-i18n], [data-trans]').forEach(element => {
            // Skip if element is in the dynamic elements list
            if (this.dynamicElements.includes(element.id)) return;

            const key = element.getAttribute('data-i18n') || element.getAttribute('data-trans');
            if (!key) return;

            const paramsAttr = element.getAttribute('data-i18n-params') || element.getAttribute('data-trans-params');
            let params = null;
            
            if (paramsAttr) {
                try {
                    params = JSON.parse(paramsAttr);
                } catch (e) {
                    console.error('Error parsing parameters:', e);
                }
            }

            const translatedText = this.getTranslation(key, params);
            if (translatedText) {
                element.textContent = translatedText;
            }
        });
    }
}

// Initialize translation manager
window.i18n = new TranslationManager();

// Listen for translation updates
document.addEventListener('translations-loaded', () => {
    if (window.i18n) {
        window.i18n.updatePageTranslations();
    }
});
