const video = document.getElementById('video');
const canvas = document.getElementById('overlayCanvas');
const context = canvas.getContext('2d');

// Draw on the overlay canvas
function drawOverlay() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    context.fillRect(50, 50, 100, 100); // Example rectangle
    // You can add more drawing commands here
}

// Update the overlay canvas as the video plays
video.addEventListener('play', () => {
    function updateCanvas() {
        if (!video.paused && !video.ended) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            drawOverlay();
            requestAnimationFrame(updateCanvas);
        }
    }
    updateCanvas();
});
