// Canvas initialization

var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.fillStyle = "#ff0000";
context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

// Box2d initialization

window.onload = function() {
	using(Box2D, "b2.+");
	init();
	changeTest();
	animate();
};

// Game logic



// Utility classes & functions

