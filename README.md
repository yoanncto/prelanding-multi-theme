# Prelanding Pages

The prelanding folder contains a complete system for creating interactive pre-landing pages with multiple themes, games, and language support:

## Structure

```
prelanding/
├── index.html          # Main entry point with dynamic theme/game loading
├── assets/            # Shared assets (images, logos, etc.)
├── themes/            # Theme-specific templates and styles
│   ├── amazon/        # Amazon-themed templates
│   │   ├── box.html
│   │   ├── scratch.html
│   │   └── slot.html
│   ├── ebay/          # eBay-themed templates
│   │   ├── box.html
│   │   ├── scratch.html
│   │   └── slot.html
│   ├── shopify/       # Shopify-themed templates
│   │   ├── box.html
│   │   ├── scratch.html
│   │   └── slot.html
│   └── theme-manager.js  # Theme and game management
└── translations/      # Multilingual support
    ├── en.json       # English translations
    ├── de.json       # German translations
    ├── fr.json       # French translations
    ├── fi.json       # Finnish translations
    ├── at.json       # Austrian German translations
    ├── be-fr.json    # Belgian French translations
    ├── be-nl.json    # Belgian Dutch translations
    ├── ch-de.json    # Swiss German translations
    ├── ch-fr.json    # Swiss French translations
    ├── ee.json       # Estonian translations
    ├── es.json       # Spanish translations
    ├── gb.json       # British English translations
    ├── gr.json       # Greek translations
    ├── hu.json       # Hungarian translations
    ├── it.json       # Italian translations
    ├── lu-de.json    # Luxembourg German translations
    ├── lu-fr.json    # Luxembourg French translations
    ├── no.json       # Norwegian translations
    ├── se.json       # Swedish translations
    └── translations.js  # Translation management system
```

## Features

*   **Multiple Themes:** Support for Amazon, eBay, and Shopify visual styles
*   **Interactive Games:**
    *   Box Game: Mystery box selection game
    *   Scratch Card: Interactive scratch-to-reveal game
    *   Slot Machine: Spinning slot machine game
*   **Dynamic Loading:** Load any theme and game combination on demand
*   **Robust Translation System:**
    *   Full translation management system
    *   Support for 20+ languages and regional variants
    *   Automatic browser language detection
    *   URL parameter language override
    *   Dynamic content translation support
    *   Fallback to English for missing translations
    *   Error handling and recovery
*   **Smart Currency Formatting:**
    *   Automatic locale-based currency formatting
    *   Support for 20+ regional currency formats
    *   Proper currency symbol placement (prefix/suffix)
    *   Region-specific decimal and thousands separators
    *   Handles Euro, Pound Sterling, Swiss Franc, and Nordic Krona
    *   Automatic fallback to default format

## Usage

Access the prelanding page with URL parameters to customize the experience:

```
/prelanding/index.html?theme=amazon&game=slot&price=299.99&retailPrice=499.99&productName=Gaming+Console&productImage=https://placehold.co/600x400&checkoutLink=https://checkout.example.com/product/123&px=your_px_value&lang=de
```

### Parameters:

*   `theme`: `amazon`, `ebay`, or `shopify` (defaults to `amazon`)
*   `game`: `box`, `scratch`, or `slot` (defaults to `box`)
*   `lang`: Supports 20+ language codes (defaults to browser language)
    *   Standard codes: `en`, `de`, `fr`, `fi`, `es`, `it`, etc.
    *   Regional variants: `gb` (British English), `at` (Austrian German), `ch-fr` (Swiss French), etc.
    *   Affects currency format (e.g., '1.234,56 €' in German, '£1,234.56' in British English)
*   `price`: The discounted product price (e.g. 299.99)
    *   Automatically formatted based on locale (e.g., "1.299,99 €" in German, "£1,299.99" in British)
*   `retailPrice`: The original retail price (e.g. 499.99)
    *   Follows the same locale-based formatting as `price`
*   `productName`: The name of the product (e.g. "Gaming Console")
*   `productImage`: URL of the product image
*   `checkoutLink`: The URL for the checkout/purchase page (defaults to `'#'` if not provided)
*   `px`: Optional tracking parameter that will be appended to the checkout URL
    *   If provided, it will be automatically added to the checkout link
    *   For example, if `px=ABC123`:
        *   Checkout URL without parameters: `https://example.com/checkout` → `https://example.com/checkout?px=ABC123`
        *   Checkout URL with parameters: `https://example.com/checkout?ref=special` → `https://example.com/checkout?ref=special&px=ABC123`
*   `debug`: `true` or `false` (defaults to `false`)
    *   If set to `true`, enables detailed console logging for debugging purposes.
    *   Example: `...?debug=true`

## Recent Updates

*   Added dynamic product content support across all templates
*   Fixed script paths to use absolute paths
*   Added debug logging throughout
*   Improved translation system with dynamic content handling
*   Removed hardcoded values from templates
*   Fixed parameter consistency (`retailPrice` instead of `originalPrice`)
*   Added proper error handling for translations
*   Improved loading and initialization sequence
*   Added checkout link parameter support across all templates
*   Added comprehensive currency formatting system with locale support
*   Added URL parameter hiding for improved security (parameters are removed from URL after page load)
*   Enhanced URL cleaning to show only root domain while maintaining functionality
*   Updated all asset paths to use absolute references for improved reliability
*   Fixed currency formatting in game result sections across all themes
*   Improved price formatting consistency between initial display and game results
*   Added missing translations (checkout, lead form, page titles) for GR, HU, NL, CZ, CH, CH-DE, CH-FR, LU-DE, LU-FR.

## Security Features

*   **URL Parameter Hiding:** All URL parameters are cleaned after page load
    *   Original URL: `domain.com/prelanding/index.html?theme=amazon&price=299.99...`
    *   Cleaned URL: `domain.com`
    *   All functionality remains intact while keeping parameters private
    *   Improves user experience and security
    *   Prevents parameter exposure in browser history
    *   Maintains proper asset loading through base tag

Each theme maintains consistent branding while providing unique interactive experiences. The translation system ensures proper localization across all supported languages and regions, with intelligent fallback to English if a translation is missing. 