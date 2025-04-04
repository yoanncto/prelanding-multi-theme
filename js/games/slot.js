// js/games/slot.js

console.log('slot.js loaded');

window.initializeGame = function(productParams) {
    console.log('Initializing Slot Game with params:', productParams);

    const openGameBtn = document.getElementById('openGameBtn') || document.getElementById('openGame');
    const gameOverlay = document.getElementById('gameOverlay');
    const gameContent = document.getElementById('gameContent'); // Contains slots and spin button
    const resultSection = document.getElementById('resultSection');
    const spinButton = gameContent?.querySelector('#spinButton');
    const slotElements = gameContent?.querySelectorAll('.slot'); // The containers for slot icons
    const spinsLeftSpan = gameContent?.querySelector('#spinsLeft'); // Optional: Display remaining spins

    if (!openGameBtn || !gameOverlay || !gameContent || !resultSection || !spinButton || !slotElements || slotElements.length === 0) {
        console.error('Slot game initialization failed: Missing essential elements.', {
            openGameBtn: !!openGameBtn,
            gameOverlay: !!gameOverlay,
            gameContent: !!gameContent,
            resultSection: !!resultSection,
            spinButton: !!spinButton,
            slotElements: slotElements?.length
        });
        return;
    }

    let spinsRemaining = 3; // Example: Allow 3 spins
    let isSpinning = false;

    // Optional: Update spins display initially
    if (spinsLeftSpan) spinsLeftSpan.textContent = spinsRemaining;

    // 1. Open Game Overlay
    openGameBtn.addEventListener('click', () => {
        console.log('Opening slot game overlay');
        // Reset state if overlay was closed and reopened
        spinButton.disabled = false;
        isSpinning = false;
        spinsRemaining = 3; // Reset spins
        if (spinsLeftSpan) spinsLeftSpan.textContent = spinsRemaining;
        slotElements.forEach(slot => slot.classList.remove('spinning')); // Ensure not spinning
        resultSection.classList.add('hidden'); // Ensure result is hidden
        resultSection.classList.remove('opacity-100');
        gameContent.classList.remove('hidden'); // Ensure game content is shown
        gameContent.classList.add('opacity-100');

        gameOverlay.classList.remove('hidden');
        gameOverlay.classList.add('opacity-100');
    });

    // 2. Handle Spin Button Click
    spinButton.addEventListener('click', () => {
        if (isSpinning || spinsRemaining <= 0) return;

        isSpinning = true;
        spinsRemaining--;
        if (spinsLeftSpan) spinsLeftSpan.textContent = spinsRemaining;

        console.log(`Spinning... ${spinsRemaining} spins left.`);

        spinButton.disabled = true;
        const originalButtonTextKey = spinButton.dataset.i18n || 'games.slot.button'; // Store original key
        spinButton.setAttribute('data-i18n', 'games.slot.spinning'); // Change text to spinning
        window.i18n?.updatePageTranslations(); // Update button text

        // Add spinning class to slots for animation
        slotElements.forEach(slot => {
            slot.classList.add('spinning');
            // Optional: Add logic here to rapidly change the icons within each slot
            // for a more realistic visual effect during the spin animation.
        });

        // Simulate spin duration
        setTimeout(() => {
            console.log('Spin finished.');
            slotElements.forEach(slot => {
                slot.classList.remove('spinning');
                // Optional: Set final winning icons here
            });

            // ** WIN CONDITION LOGIC HERE **
            // For this example, we assume the user wins on the last spin.
            const isWin = spinsRemaining === 0;

            if (isWin) {
                console.log('Win condition met! Showing results.');
                // Hide game content
                gameContent.classList.add('hidden');
                gameContent.classList.remove('opacity-100'); // Ensure opacity is off too

                // Show result section and ensure it's on top
                resultSection.classList.remove('hidden'); // Make it display (removes display:none)
                // *** Use the .visible class from index.html CSS ***
                resultSection.classList.add('visible', 'z-50'); // Add .visible and z-index

                 // Add a micro-delay to allow browser rendering/event loop tick
                 setTimeout(() => {
                     // Re-apply placeholders
                     if(window.replacePlaceholders) {
                        console.log("Re-applying placeholders to result section.");
                        window.replacePlaceholders(productParams, resultSection);
                     }
                    console.log('Slot game finished. Result section layout likely complete.');

                    // Attempt to focus the button to make it interactive immediately
                    const triggerBtn = resultSection.querySelector('#finalCheckoutTrigger');
                    if (triggerBtn) {
                        console.log('Attempting to focus the checkout trigger button.');
                        triggerBtn.focus();
                    } else {
                         console.warn('Could not find #finalCheckoutTrigger to focus.');
                    }

                }, 0); // Zero delay pushes execution after current sync operations + repaint

            } else {
                console.log('Spin did not result in a win yet.');
                // Re-enable spin button for next try
                spinButton.disabled = false;
                spinButton.setAttribute('data-i18n', originalButtonTextKey); // Reset button text
                window.i18n?.updatePageTranslations();
                isSpinning = false;
            }

        }, 2000); // Adjust spin duration as needed
    });

    console.log('Slot Game listeners initialized.');
}; 