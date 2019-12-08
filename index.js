const animationContainer = document.getElementById('animationContainer');
const canvas = document.getElementById('starlightCanvas');
const ctx = canvas.getContext("2d");

let WIDTH = 100;
let HEIGHT = 100;
let maxDistance = (WIDTH + HEIGHT) * 0.05;
setCanvasSize();
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('resize', setCanvasSize);
canvas.addEventListener('mousemove', handleMouseMove);

function setCanvasSize() {
    WIDTH = animationContainer.clientWidth;
    HEIGHT = animationContainer.clientHeight;
    console.log('Resize: ', WIDTH, HEIGHT);
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    maxDistance = (WIDTH + HEIGHT) * 0.05;
}

ctx.lineWidth = 1;
ctx.fillStyle = "#ababab";
const coefficient = 0.3;

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// ***********************

const numberOfPoints = 210;
const points = Array(numberOfPoints);

for (let i = 0; i < points.length; i++) {
    points[i] = {}
    randomPosition(points[i]);
}

function randomPosition(point) {
    point.x = Math.random() * WIDTH;
    point.y = Math.random() * HEIGHT;
    point.xMove = (Math.random() - 0.5) * coefficient;
    point.yMove = (Math.random() - 0.5) * coefficient;
}

function handleMouseMove(event) {
    cursor.x = event.layerX;
    cursor.y = event.layerY;
}

setInterval(() => {
    clearCanvas();
    // drawBackground();
    drawForeground();
    // drawCursor();
}, 15);

function drawCursor() {
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawBackground() {
    const grd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 100, WIDTH/2, HEIGHT/2, Math.max(WIDTH, HEIGHT)-300);
    grd.addColorStop(0, "#E9E9E5");
    grd.addColorStop(0.25, "#e5ebe3");
    grd.addColorStop(0.5, "#dceee7");
    grd.addColorStop(0.75, "#d2f0f0");
    grd.addColorStop(1, "#CEF1FD");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawForeground() {
    drawPaths();
    ctx.fillStyle = "#ababab";
    for (let point of points) {
        drawPoint(point);
    }
    for (let point of points) {
        movePoint(point);
    }
}

function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function movePoint(point) {
    if (calculateDistance(point, cursor) < maxDistance) {
        randomPosition(point);
    }
    if (point.x < 0 || point.y < 0 || point.x > WIDTH || point.y > HEIGHT) {
        // resetPoint(point);
        randomPosition(point);
    }
    point.x += point.xMove;
    point.y += point.yMove;
}

function resetPoint(point) {
    const variant = Math.floor(Math.random() * 4);
    switch(variant) {
        case 0:
            point.x = 0;
            point.y = Math.random() * HEIGHT;
            point.xMove = Math.random() * 0.5 * coefficient;
            point.yMove = (Math.random() - 0.5) * coefficient;
            break;
        case 1:
            point.x = WIDTH;
            point.y = Math.random() * HEIGHT;
            point.xMove = Math.random() * -0.5 * coefficient;
            point.yMove = (Math.random() - 0.5) * coefficient;
            break;
        case 2:
            point.x = Math.random() * WIDTH;
            point.y = 0;
            point.xMove = (Math.random() - 0.5) * coefficient;
            point.yMove = Math.random() * 0.5 * coefficient;
            break;
        case 3:
            point.x = Math.random() * WIDTH;
            point.y = HEIGHT;
            point.xMove = (Math.random() - 0.5) * coefficient;
            point.yMove = Math.random() * -0.5 * coefficient;
            break;
    }
}


function drawPaths() {
    for (const point1 of points) {
        for (const point2 of points) {
            const distance = calculateDistance(point1, point2);
            if (distance < maxDistance) {
                drawPath(point1, point2, distance);
            }
        }
    }
}

function drawPath(p1, p2, d) {
    ctx.beginPath();
    const t = (maxDistance - d)/maxDistance;
    ctx.strokeStyle = "rgba(80,80,80," + t + ")";
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

