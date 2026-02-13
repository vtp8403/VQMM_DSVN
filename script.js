const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

const modal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");
const closeModal = document.getElementById("closeModal");

/* ========= CẤU HÌNH ========= */

const size = 600;
canvas.width = size;
canvas.height = size;

const center = size / 2;
const radius = size / 2 - 25;

const prizes = ["TPCN", "ĐA DA", "DẦU ĂN", "SỮA HẠT"];

/* BỎ COMMENT DÒNG DƯỚI ĐỂ LUÔN TRÚNG TPCN */
const FORCE_PRIZE = "TPCN";

const tetColors = [
    ["#b31217", "#e52d27"],
    ["#f7971e", "#ffd200"],
    ["#1e9600", "#fff200"],
    ["#ff512f", "#f09819"]
];

const numPrizes = prizes.length;
const arcSize = (2 * Math.PI) / numPrizes;

let currentAngle = 0;
let spinning = false;

/* ========= POPUP ========= */

function showResult(prize) {
    resultText.innerText = "Bạn đã trúng: " + prize;
    modal.classList.add("show");
}

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});


/* ========= ĐÈN LỄ HỘI ========= */

function drawLights() {
    const lightCount = 36;
    const lightRadius = size / 2 - 5;

    for (let i = 0; i < lightCount; i++) {
        const angle = (2 * Math.PI / lightCount) * i;
        const x = center + lightRadius * Math.cos(angle);
        const y = center + lightRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? "#e70000" : "#de0038";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}


/* ========= VẼ VÒNG QUAY ========= */

function drawWheel() {

    const outerGradient = ctx.createRadialGradient(
        center, center, radius - 40,
        center, center, radius + 20
    );
    outerGradient.addColorStop(0, "#ffffff");
    outerGradient.addColorStop(1, "#ffffff");

    ctx.beginPath();
    ctx.arc(center, center, radius + 20, 0, 2 * Math.PI);
    ctx.fillStyle = outerGradient;
    ctx.fill();

    for (let i = 0; i < numPrizes; i++) {

        const angle = i * arcSize;

        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, tetColors[i][0]);
        gradient.addColorStop(1, tetColors[i][1]);

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, angle, angle + arcSize);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + arcSize / 2);

        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 26px Be Vietnam Pro";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 8;
        ctx.fillText(prizes[i], radius - 45, 10);

        ctx.restore();
    }

    // ===== TRUNG TÂM =====
    const centerRadius = 60;

    const centerGradient = ctx.createRadialGradient(
        center, center, 5,
        center, center, centerRadius
    );
    centerGradient.addColorStop(0, "#c40000");
    centerGradient.addColorStop(1, "#ff0000");

    ctx.beginPath();
    ctx.arc(center, center, centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    drawLights();
}


/* ========= QUAY ========= */

function spin() {

    if (spinning) return;
    spinning = true;

    let randomIndex;

    if (typeof FORCE_PRIZE !== "undefined") {
        randomIndex = prizes.indexOf(FORCE_PRIZE);
    } else {
        randomIndex = Math.floor(Math.random() * numPrizes);
    }

    const spins = 8;

    const stopAngle =
        (Math.PI * 1.5) -
        (randomIndex * arcSize) -
        (arcSize / 2);

    const targetAngle = (2 * Math.PI * spins) + stopAngle;

    let startTime = null;
    const duration = 10000;

    function animate(timestamp) {

        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        const easeOut = 1 - Math.pow(1 - progress / duration, 4);
        currentAngle = easeOut * targetAngle;

        ctx.clearRect(0, 0, size, size);

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(currentAngle);
        ctx.translate(-center, -center);

        drawWheel();

        ctx.restore();

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {

            spinning = false;

            showResult(prizes[randomIndex]);
        }
    }

    requestAnimationFrame(animate);
}


spinBtn.addEventListener("click", spin);

drawWheel();
