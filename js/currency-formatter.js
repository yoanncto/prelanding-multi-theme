const currencyConfig = {
    // Euro countries with symbol after amount
    'de': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
	'ie': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'at': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'fr': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'it': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'es': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'nl': { symbol: '€', placement: 'prefix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'fi': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'gr': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'ee': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'lu-fr': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'lu-de': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'be-fr': { symbol: '€', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'be-nl': { symbol: '€', placement: 'prefix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    
    // Non-Euro European countries
    'gb': { symbol: '£', placement: 'prefix', decimalSep: '.', thousandsSep: ',', decimals: 2 },
    'ch-de': { symbol: 'CHF', placement: 'prefix', decimalSep: '.', thousandsSep: '\'', decimals: 2 },
    'ch-fr': { symbol: 'CHF', placement: 'prefix', decimalSep: '.', thousandsSep: '\'', decimals: 2 },
    'dk': { symbol: 'kr', placement: 'suffix', decimalSep: ',', thousandsSep: '.', decimals: 2 },
    'no': { symbol: 'kr', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'se': { symbol: 'kr', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'hu': { symbol: 'Ft', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    'cz': { symbol: 'Kč', placement: 'suffix', decimalSep: ',', thousandsSep: ' ', decimals: 2 },
    
    // Default (English)
    'en': { symbol: '$', placement: 'prefix', decimalSep: '.', thousandsSep: ',', decimals: 2 }
};

class CurrencyFormatter {
    constructor() {
        this.locale = window.i18n?.currentLang || 'en';
        this.config = currencyConfig[this.locale] || currencyConfig['en'];
    }

    format(amount, options = {}) {
        const config = { ...this.config, ...options };
        
        // Convert amount to number if it's a string
        const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.-]/g, '')) : amount;
        
        // Format the number with proper separators
        let [intPart, decPart] = numAmount.toFixed(config.decimals).split('.');
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSep);
        
        // Combine with decimal part
        const formattedNumber = decPart ? `${intPart}${config.decimalSep}${decPart}` : intPart;
        
        // Add currency symbol in correct position
        return config.placement === 'prefix' 
            ? `${config.symbol}${formattedNumber}`
            : `${formattedNumber}${config.symbol}`;
    }

    parse(formattedAmount) {
        if (!formattedAmount) return 0;
        
        // Remove currency symbol and thousands separators, replace decimal separator with '.'
        const cleanAmount = formattedAmount
            .replace(this.config.symbol, '')
            .replace(new RegExp(`\\${this.config.thousandsSep}`, 'g'), '')
            .replace(new RegExp(`\\${this.config.decimalSep}`, 'g'), '.')
            .trim();
            
        return parseFloat(cleanAmount) || 0;
    }
}

// Initialize global currency formatter
window.currencyFormatter = new CurrencyFormatter(); 