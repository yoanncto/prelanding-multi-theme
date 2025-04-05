/**
 * DOM utilities module
 * Provides DOM manipulation functions including placeholder replacement
 */

const DomUtils = {
    /**
     * Replace placeholders in the DOM with actual values
     * @param {Object} params - Object containing parameter values
     * @param {HTMLElement} containerElement - Container element to process
     */
    replacePlaceholders: function(params, containerElement) {
        if (!containerElement) {
            console.warn("replacePlaceholders called without containerElement");
            return;
        }
        console.log('Running replacePlaceholders for container:', containerElement.id || containerElement.tagName);

        const price = window.currencyFormatter?.format(params.price) || params.price;
        const retailPrice = window.currencyFormatter?.format(params.retailPrice) || params.retailPrice;
        // Note: checkoutLink with px param is handled better in themeManager/checkoutHandler now
        const checkoutLinkForData = params.checkoutLink || '#'; // Raw link for potential data attributes

        const replacements = {
            '{PRODUCT_NAME}': params.productName,
            '{PRODUCT_PRICE}': price,
            '{PRODUCT_RETAIL_PRICE}': retailPrice,
            '{PRODUCT_IMAGE}': params.productImage,
            // We don't replace {CHECKOUT_LINK} directly in hrefs anymore
        };

        const walker = document.createTreeWalker(containerElement, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToProcess = [];
        while(node = walker.nextNode()) {
            nodesToProcess.push(node);
        }

        nodesToProcess.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let originalValue = node.nodeValue;
                Object.keys(replacements).forEach(key => {
                    if (originalValue.includes(key)) {
                        // Correctly escaped RegExp
                        originalValue = originalValue.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacements[key]);
                        node.nodeValue = originalValue;
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Replace in text content of specific data attributes (like data-product-name)
                Object.keys(node.dataset).forEach(dataKey => {
                    let value = node.dataset[dataKey];
                    Object.keys(replacements).forEach(key => {
                        if(value === key) { // Check if data attribute value IS the placeholder
                            // Replace the element's text content, not the data attribute itself
                            if(node.textContent.includes(key)) {
                                node.textContent = node.textContent.replace(key, replacements[key]);
                                console.log(`Replaced text for data attribute ${dataKey} on`, node);
                            }
                        } else if (value.includes(key)) { // Replace within data attribute value if needed
                            // Correctly escaped RegExp
                            node.dataset[dataKey] = value.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacements[key]);
                        }
                    });
                });

                // Replace in specific attributes like src
                if (node.tagName === 'IMG' && node.getAttribute('src')?.includes('{PRODUCT_IMAGE}')) {
                    node.src = replacements['{PRODUCT_IMAGE}'];
                }
                // Replace in anchor href if it explicitly uses a placeholder (less common now)
                if (node.tagName === 'A' && node.getAttribute('href')?.includes('{CHECKOUT_LINK}')) {
                    console.warn("Found direct {CHECKOUT_LINK} in href, replacing but prefer data attributes or JS handling:", node);
                    node.href = checkoutLinkForData; // Use raw link
                }
            }
        });
        console.log('Placeholder replacement finished for container.');
    },

    /**
     * Setup base tag for the page
     * @param {string} basePath - The base path to set
     */
    setupBaseTag: function(basePath) {
        const baseTag = document.createElement('base');
        baseTag.href = new URL(basePath, window.location.origin).href;
        const existingBase = document.querySelector('base');
        if (existingBase) existingBase.remove();
        document.head.prepend(baseTag);
        console.log('Base tag set to:', baseTag.href);
        return baseTag.href;
    },

    /**
     * Setup favicon for the page
     * @param {string} theme - Theme name to use for the favicon
     */
    setupFavicon: function(theme) {
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = `assets/${theme}favicon.ico`;
        faviconLink.type = 'image/x-icon';
        document.querySelectorAll("link[rel='icon']").forEach(link => link.remove());
        document.head.appendChild(faviconLink);
        console.log('Favicon set to:', faviconLink.href);
        return faviconLink.href;
    }
};

export default DomUtils; 