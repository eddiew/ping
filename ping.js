// Canvas initialization

var W, H;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var maxW = window.innerWidth, maxH = window.innerHeight;
if (maxW / maxH > 16 / 9) {
	context.canvas.width = maxH * 16 / 9;
	context.canvas.height = maxH;
}
else {
	context.canvas.width = maxW;
	context.canvas.height = maxW * 9 / 16;
}
W = context.canvas.width;
H = context.canvas.height;
canvas.style.width = W;
canvas.style.height = H;
context.fillStyle = "#ff0000";
context.fillRect(0, 0, W, H);

// Box2d initialization

window.onload = function() {
	using(Box2D, "b2.+");
	init();
	changeTest();
	animate();
};

// Game logic



// Utility classes & functions

