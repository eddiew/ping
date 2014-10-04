// Canvas initialization

var W, H;
var FPS = 60;

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

// Box2d initialization

window.onload = function() {
	using(Box2D, "b2.+");
	init();
	changeTest();
	animate();
};

// Game logic

window.setInterval(function(){update()}, 1000/FPS);

function update()
{
	getInput();
	// do physics
	draw();
}

function getInput()
{
	
}

function draw()
{
	context.fillStyle = "#000000";
	context.fillRect(0, 0, W, H);
}



// Utility classes & functions

