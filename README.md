# Prelanding Multi-Theme

A modular JavaScript application for handling themed offer pages with interactive games.

## Structure

The application has been modularized for better maintainability and separation of concerns:

```
js/
├── main.js                  # Main entry point
├── modules/
│   ├── debug-utils.js       # Debug mode and console logging utilities
│   ├── dom-utils.js         # DOM manipulation and placeholder replacement
│   ├── game-loader.js       # Game script loading and initialization
│   ├── page-initializer.js  # Main page initialization sequence
│   ├── param-validator.js   # URL parameter validation
│   └── ui-utils.js          # UI utilities like page title updates
├── games/                   # Game-specific JavaScript files
│   └── [game type].js       # Implementations for different games
└── checkout-handler.js      # Checkout functionality
```

## Features

- Modular JavaScript architecture with ES modules
- Theme support for multiple e-commerce platforms
- Game mechanics for interactive offers
- Translation support
- URL parameter validation
- Debug mode for development

## Usage

The application requires several URL parameters to function correctly:
- `price`: Product price
- `productName`: Name of the product
- `productImage`: URL to product image
- `checkoutLink`: Link to checkout page

Example URL:
```
index.html?price=29.99&productName=Amazing%20Product&productImage=https://example.com/image.jpg&checkoutLink=https://checkout.example.com
```

Enable debug mode by adding `debug=true` to the URL parameters. 