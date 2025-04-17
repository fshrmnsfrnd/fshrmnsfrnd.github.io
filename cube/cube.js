const cube = document.getElementById("cube");
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
let rotateX = 0, rotateY = 0;

//Desktop / Mouse

cube.addEventListener("mousedown", (e) => {
    isDragging = true;
    cube.style.animation = "none";
    startX = e.clientX;
    startY = e.clientY;
});
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    currentX = rotateX + dy;
    currentY = rotateY + dx;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
});
document.addEventListener("mouseup", () => {
    isDragging = false;
    rotateX = currentX;
    rotateY = currentY;
});

//Mobile / Touch

cube.addEventListener("touchstart", (e) => {
    isDragging = true;
    cube.style.animation = "none";
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener("touchmove", (e) => {
    //if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    currentX = rotateX + dy;
    currentY = rotateY + dx;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
});

document.addEventListener("touchend", () => {
    isDragging = false;
    rotateX = currentX;
    rotateY = currentY;
});