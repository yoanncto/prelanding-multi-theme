// js/games/box.js

console.log('box.js loaded');

window.initializeGame = function(productParams) {
    console.log('Initializing Box Game with params:', productParams);

    const openGameBtn = document.getElementById('openGameBtn') || document.getElementById('openGame'); // Handle potential ID variations
    const gameOverlay = document.getElementById('gameOverlay');
    const gameContent = document.getElementById('gameContent'); // The div containing the boxes
    const resultSection = document.getElementById('resultSection');
    const boxes = gameContent?.querySelectorAll('.box'); // Get boxes within the game content

    if (!openGameBtn || !gameOverlay || !gameContent || !resultSection || !boxes || boxes.length === 0) {
        console.error('Box game initialization failed: Missing essential elements.', {
            openGameBtn: !!openGameBtn,
            gameOverlay: !!gameOverlay,
            gameContent: !!gameContent,
            resultSection: !!resultSection,
            boxes: boxes?.length
        });
        return; // Stop initialization if elements are missing
    }

    // 1. Open Game Overlay
    openGameBtn.addEventListener('click', () => {
        console.log('Opening box game overlay');
        gameOverlay.classList.remove('hidden');
        gameOverlay.classList.add('opacity-100'); // Assuming fade-in/opacity transition
    });

    // 2. Handle Box Selection
    boxes.forEach(box => {
        // Remove previous listeners if re-initializing (though ideally, init is only called once)
        const newBox = box.cloneNode(true);
        box.parentNode.replaceChild(newBox, box);

        newBox.addEventListener('click', () => {
            console.log(`Box ${newBox.dataset.box} selected.`);

            // Add visual feedback (e.g., highlight selected box - optional)
            boxes.forEach(b => b.classList.remove('border-4', 'border-yellow-400')); // Clear others
            newBox.classList.add('border-4', 'border-yellow-400'); // Highlight

            // Disable further clicks on boxes
            boxes.forEach(b => b.style.pointerEvents = 'none');

            // Simulate a brief delay for effect, then show result
            setTimeout(() => {
                console.log('Showing result section...');
                // Hide game content (boxes)
                gameContent.classList.add('hidden'); // Or use a fade-out animation class
                gameContent.classList.remove('opacity-100');

                // Show result section - Use .visible class
                resultSection.classList.remove('hidden');
                resultSection.classList.add('visible', 'z-50'); // Add .visible and z-index

                 // Ensure placeholders in the result section are replaced again (if needed)
                 if(window.replacePlaceholders) {
                    console.log("Re-applying placeholders to result section just in case.");
                    window.replacePlaceholders(productParams, resultSection);
                 }

                // The button (#finalCheckoutTrigger) inside resultSection already has its
                // onclick event set in the HTML template to call window.loadCheckoutPage()
                console.log('Box game finished. Result section displayed.');

            }, 500); // Adjust delay as needed
        });
    });

    console.log('Box Game listeners initialized.');
}; 