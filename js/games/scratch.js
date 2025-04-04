// js/games/scratch.js

console.log('scratch.js loaded');

window.initializeGame = function(productParams) {
    console.log('Initializing Scratch Game with params:', productParams);

    const openGameBtn = document.getElementById('openGameBtn') || document.getElementById('openGame');
    const gameOverlay = document.getElementById('gameOverlay');
    const gameContent = document.getElementById('gameContent'); // Contains the scratch card
    const resultSection = document.getElementById('resultSection'); // This is separate in the scratch template HTML
    const revealCover = gameContent?.querySelector('#revealCover'); // The element to be "scratched"

    if (!openGameBtn || !gameOverlay || !gameContent || !resultSection || !revealCover) {
        console.error('Scratch game initialization failed: Missing essential elements.', {
            openGameBtn: !!openGameBtn,
            gameOverlay: !!gameOverlay,
            gameContent: !!gameContent,
            resultSection: !!resultSection,
            revealCover: !!revealCover
        });
        return;
    }

    let isRevealing = false; // Prevent multiple reveals

    // 1. Open Game Overlay
    openGameBtn.addEventListener('click', () => {
        console.log('Opening scratch game overlay');
        // Reset state if overlay was closed and reopened
        revealCover.classList.remove('opacity-0', 'pointer-events-none'); // Make cover visible again
        revealCover.style.clipPath = ''; // Reset clip path if used
        isRevealing = false;
        gameOverlay.classList.remove('hidden');
        gameOverlay.classList.add('opacity-100');
    });

    // 2. Handle Scratch/Reveal Action
    // Using simple click reveal for now. Could be enhanced with canvas/mouse events for actual scratching.
    revealCover.addEventListener('click', () => {
        if (isRevealing) return;
        isRevealing = true;

        console.log('Reveal cover clicked.');

        // Animate the reveal (e.g., fade out)
        revealCover.classList.add('opacity-0', 'transition-opacity', 'duration-500', 'ease-out');
        revealCover.classList.add('pointer-events-none'); // Make it non-interactive after click

        // After the reveal animation finishes, show the result section
        // Note: In the scratch template HTML, the result *content* is under the cover,
        // but the final button is in a separate #resultSection div which was hidden.
        // We need to hide the #gameContent and show #resultSection.

        setTimeout(() => {
            console.log('Reveal animation finished. Showing result section...');
            gameContent.classList.add('hidden'); // Hide the whole game content area
            resultSection.classList.remove('hidden'); // Show the separate result section
            resultSection.classList.add('visible', 'z-50'); // Add .visible and z-index

             // Re-apply placeholders to the result section
             if(window.replacePlaceholders) {
                console.log("Re-applying placeholders to result section.");
                window.replacePlaceholders(productParams, resultSection);
             }

            console.log('Scratch game finished. Result section displayed.');
            // isRevealing = false; // Reset if needed, though typically game ends here

        }, 500); // Match duration of reveal animation
    });

    console.log('Scratch Game listeners initialized.');
}; 