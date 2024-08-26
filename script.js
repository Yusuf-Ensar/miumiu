document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.querySelector('.start-screen');
    const gameScreen = document.querySelector('.game-screen');
    const heartPieces = document.querySelector('.heart-pieces');
    const otherImages = document.querySelector('.other-images');
    const message = document.querySelector('.message');
    const brokenHeart = document.querySelector('.broken-heart');
    const completionMusic = document.getElementById('completion-music');
    const totalPieces = 4;
    const totalOtherImages = 16;
    const pieceSize = 100; // Size of each image
    const spacing = 20; // Space between images

    const pieceIds = ['heart-piece-1', 'heart-piece-2', 'heart-piece-3', 'heart-piece-4'];

    function getRandomPosition(existingPositions) {
        let x, y;
        let tries = 0;
        const maxTries = 100; // Avoid infinite loop

        do {
            x = Math.random() * (window.innerWidth - pieceSize - spacing);
            y = Math.random() * (window.innerHeight - pieceSize - spacing);
            tries++;
        } while (existingPositions.some(pos =>
            Math.abs(pos.x - x) < pieceSize + spacing && Math.abs(pos.y - y) < pieceSize + spacing) && tries < maxTries);

        return { x, y };
    }

    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        let positions = [];

        pieceIds.forEach((id) => {
            const piece = document.createElement('div');
            piece.classList.add('heart-piece');
            piece.id = id;

            const position = getRandomPosition(positions);
            piece.style.top = `${position.y}px`;
            piece.style.left = `${position.x}px`;

            piece.addEventListener('click', () => {
                piece.remove();
                checkCompletion();
            });

            heartPieces.appendChild(piece);
            positions.push(position);
        });

        for (let i = 1; i <= totalOtherImages; i++) {
            const img = document.createElement('img');
            img.src = `images/other_image_${i}.png`;
            img.classList.add('other-image');

            img.onload = () => {
                const position = getRandomPosition(positions);
                img.style.top = `${position.y}px`;
                img.style.left = `${position.x}px`;
                img.addEventListener('click', () => {
                    alert('Oops! That’s not a heart piece. Try again!');
                });
                otherImages.appendChild(img);
                positions.push(position);
            };

            img.onerror = () => {
                console.error(`Failed to load image images/other_image_${i}.png`);
            };
        }
    }

    function checkCompletion() {
        if (document.querySelectorAll('.heart-piece').length === 0) {
            // Hide other images
            document.querySelectorAll('.other-image').forEach(img => img.style.display = 'none');
            
            // Show broken heart image and message
            brokenHeart.style.display = 'block';
            message.textContent = "I'm so sorry for hurting you. Will you forgive me?";
            message.style.display = 'block'; // Make sure the message is displayed

            // Play completion music
            completionMusic.play();
        }
    }

    function restartGame() {
        startScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        heartPieces.innerHTML = '';
        otherImages.innerHTML = '';
        message.textContent = '';
        message.style.display = 'none'; // Hide message on restart
        brokenHeart.style.display = 'none';
        
        // Stop the music when the game is restarted
        completionMusic.pause();
        completionMusic.currentTime = 0;
    }

    document.querySelector('.start-button').addEventListener('click', startGame);
});

