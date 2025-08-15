const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastX = null, lastY = null;
let shakeCounter = 0;

const hands = new Hands({locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({maxNumHands: 1, modelComplexity: 1});
hands.onResults(results => {
  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexTip = landmarks[8];
    const x = indexTip.x * canvas.width;
    const y = indexTip.y * canvas.height;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    if (lastX !== null && lastY !== null) {
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 50) {
        shakeCounter++;
        if (shakeCounter > 5) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          shakeCounter = 0;
          console.log("Canvas cleared by shake!");
        }
      } else {
        shakeCounter = 0;
      }
    }

    lastX = x;
    lastY = y;
  }
});

const camera = new Camera(video, {
  onFrame: async () => await hands.send({image: video}),
  width: 640,
  height: 480
});
camera.start();
