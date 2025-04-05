// js/checkout-handler.js
(function() {
    'use strict';

    console.log('checkout-handler.js executing');

    let finalCheckoutUrl = '#'; // To store the original checkout link for final redirection

    // --- DOM Element References ---
    let checkoutForm = null;
    let submitButton = null;
    let formErrorElement = null;
    // Input fields
    let firstNameInput, lastNameInput, addressInput, cityInput, zipCodeInput, emailInput, phoneInput, clickIdInput, tokenInput, checkoutLinkInput;

    // --- Helper Functions ---
    function getCheckoutElements() {
        checkoutForm = document.getElementById('checkoutForm');
        submitButton = document.getElementById('submitCheckoutBtn'); // Ensure this ID is on the submit button in checkout.html
        formErrorElement = document.getElementById('checkoutFormError'); // Ensure this div exists in checkout.html

        if (!checkoutForm || !submitButton) {
            console.error('Checkout handler: Could not find essential checkout form elements (form, submit button). Aborting setup.');
            return false;
        }

        // Get input references within the checkout form
        firstNameInput = checkoutForm.querySelector('#firstName');
        lastNameInput = checkoutForm.querySelector('#lastName');
        addressInput = checkoutForm.querySelector('#address');
        cityInput = checkoutForm.querySelector('#city');
        zipCodeInput = checkoutForm.querySelector('#zipCode');
        emailInput = checkoutForm.querySelector('#email');
        phoneInput = checkoutForm.querySelector('#phone');
        clickIdInput = checkoutForm.querySelector('#clickid');
        tokenInput = checkoutForm.querySelector('#token');
        checkoutLinkInput = checkoutForm.querySelector('#checkoutLink');

        return true;
    }

    function displayCheckoutError(message) {
        if (formErrorElement) {
            formErrorElement.textContent = message;
            formErrorElement.classList.remove('hidden');
        } else {
            console.error("Checkout form error element not found, cannot display message:", message);
        }
    }

    function clearCheckoutError() {
        if (formErrorElement) {
            formErrorElement.textContent = '';
            formErrorElement.classList.add('hidden');
        }
    }

    function validateCheckoutForm() {
        clearCheckoutError();
        let isValid = true;
        const inputsToValidate = [
            { input: firstNameInput, name: 'First Name' },
            { input: lastNameInput, name: 'Last Name' },
            { input: addressInput, name: 'Address' },
            { input: cityInput, name: 'City' },
            { input: zipCodeInput, name: 'Zip Code' },
            { input: emailInput, name: 'Email' },
            { input: phoneInput, name: 'Phone' }
        ];

        inputsToValidate.forEach(({ input, name }) => {
            if (!input) {
                 console.warn(`Validation skipped: Input field for ${name} not found in checkout form.`);
                 return;
            }

             input.classList.remove('border-red-500');
             input.removeAttribute('aria-invalid');

            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
                input.setAttribute('aria-invalid', 'true');
                 // Display first error
                 if (!formErrorElement.textContent) displayCheckoutError(`${name} is required.`);
            } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                isValid = false;
                input.classList.add('border-red-500');
                input.setAttribute('aria-invalid', 'true');
                 if (!formErrorElement.textContent) displayCheckoutError(`Please enter a valid email address.`);
            } else if (input.type === 'tel' && !/^[+]?[\d\s()-]{7,}$/.test(input.value.trim())) {
                 isValid = false;
                 input.classList.add('border-red-500');
                 input.setAttribute('aria-invalid', 'true');
                  if (!formErrorElement.textContent) displayCheckoutError(`Please enter a valid phone number.`);
            }
            // Add more specific validation rules if needed (e.g., zip code format)
        });

         if (!isValid) {
             console.warn('Checkout form validation failed.');
         } else {
             console.log('Checkout form validation passed.');
         }
        return isValid;
    }

    // --- Form Submission Handler ---
    async function handleCheckoutFormSubmit(event) {
        event.preventDefault();
        console.log('Checkout form submission triggered.');

        if (!validateCheckoutForm()) {
            const firstInvalid = checkoutForm.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        submitButton.disabled = true;
        // Use translation key for button text if available
        const processingText = window.i18n?.getTranslation('checkout.processing_button') || 'Processing...';
        submitButton.textContent = processingText;

        const formData = new FormData(checkoutForm);
        const leadData = {};
        formData.forEach((value, key) => {
            leadData[key] = value.trim();
        });

        console.log('Checkout Lead Data Collected:', leadData);

        // ** Placeholder for sending data **
        try {
            console.log('Simulating sending checkout lead data...');

            let keitaroUpdateUrl = `https://tracker.anthar.io/920f41e/postback?subid=${clickIdInput.value}&status=lead&payout=0`; // Mark as lead
            keitaroUpdateUrl += `&first_name=${encodeURIComponent(firstNameInput.value || '')}`;
            keitaroUpdateUrl += `&last_name=${encodeURIComponent(lastNameInput.value || '')}`;
            keitaroUpdateUrl += `&email=${encodeURIComponent(emailInput.value || '')}`;
            keitaroUpdateUrl += `&phone=${encodeURIComponent(phoneInput.value || '')}`;
            keitaroUpdateUrl += `&address=${encodeURIComponent(addressInput.value || '')}`;
            keitaroUpdateUrl += `&zipcode=${encodeURIComponent(zipCodeInput.value || '')}`;
            keitaroUpdateUrl += `&lead_city=${encodeURIComponent(cityInput.value || '')}`;
            var response=  await fetch(keitaroUpdateUrl, { method: 'GET' });
            console.log('Response:', response);
            console.log('Checkout lead data "sent" successfully.');

            let finalCheckoutUrl = `${checkoutLinkInput.value}&_token=${tokenInput.value}`;
            finalCheckoutUrl += `&first_name=${encodeURIComponent(firstNameInput.value || '')}`;
            finalCheckoutUrl += `&last_name=${encodeURIComponent(lastNameInput.value || '')}`;
            finalCheckoutUrl += `&email=${encodeURIComponent(emailInput.value || '')}`;
            finalCheckoutUrl += `&phone=${encodeURIComponent(phoneInput.value || '')}`;
            finalCheckoutUrl += `&address=${encodeURIComponent(addressInput.value || '')}`;
            finalCheckoutUrl += `&zipcode=${encodeURIComponent(zipCodeInput.value || '')}`;
            finalCheckoutUrl += `&lead_city=${encodeURIComponent(cityInput.value || '')}`;

            // --- Final Redirect ---
            console.log('Proceeding to final redirect to:', finalCheckoutUrl);
            if (finalCheckoutUrl && finalCheckoutUrl !== '#') {
                window.location.href = finalCheckoutUrl;
            } else {
                console.error('Final Checkout URL is invalid or missing. Cannot redirect.');
                displayCheckoutError('Error: Could not complete purchase. Please contact support.');
                submitButton.disabled = false;
                 const submitText = window.i18n?.getTranslation('checkout.submit_button') || 'Complete Purchase';
                 submitButton.textContent = submitText;
            }

        } catch (error) {
            console.error('Error processing checkout form submission:', error);
            displayCheckoutError('An error occurred. Please try again.');
            submitButton.disabled = false;
            const submitText = window.i18n?.getTranslation('checkout.submit_button') || 'Complete Purchase';
            submitButton.textContent = submitText;
        }
    }

    // --- Initialization Function (called by theme-manager after loading checkout.html) ---
    window.initializeCheckoutForm = function(productParams) {
        console.log('Initializing checkout form logic...', productParams);

        if (!getCheckoutElements()) {
            // Elements might not be ready immediately after innerHTML change,
            // use a small delay or MutationObserver if needed, but usually DOM is ready.
            console.error("Could not find checkout form elements immediately after load.");
             // Attempt retry after small delay
             setTimeout(() => {
                 if(getCheckoutElements()) {
                    setupCheckoutListeners(productParams);
                 } else {
                     console.error("Still could not find checkout elements after delay.");
                 }
             }, 100);
            return;
        }

         setupCheckoutListeners(productParams);

    };

     function setupCheckoutListeners(productParams) {
        // Store the final checkout URL (passed from themeManager)
        finalCheckoutUrl = productParams?.checkoutLink || '#';
         // Ensure the px parameter is appended if present (logic might be duplicated from themeManager, consider centralizing)
         if (finalCheckoutUrl !== '#' && productParams?.px) {
             try {
                 const url = new URL(finalCheckoutUrl);
                 url.searchParams.set('px', productParams.px);
                 finalCheckoutUrl = url.toString();
                  console.log("Checkout handler confirmed final redirect URL with px:", finalCheckoutUrl);
             } catch (e) {
                 console.warn("Invalid final checkout URL in checkout handler, cannot append px:", finalCheckoutUrl, e);
                  const separator = finalCheckoutUrl.includes('?') ? '&' : '?';
                  finalCheckoutUrl = `${finalCheckoutUrl}${separator}px=${encodeURIComponent(productParams.px)}`;
             }
         }

        console.log('Final redirect URL stored:', finalCheckoutUrl);

        // Add the submit event listener
        if (checkoutForm) {
            // Remove potentially existing listener before adding a new one
            // Cloning the form isn't ideal here, better to track listener state if needed
            // For simplicity, we assume initializeCheckoutForm is called only once per load.
            checkoutForm.addEventListener('submit', handleCheckoutFormSubmit);
            console.log('Submit event listener added to checkout form.');
        } else {
             console.error("Cannot add submit listener: Checkout form not found.");
        }
     }

})(); // IIFE End 