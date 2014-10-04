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

using(Box2D, "b2.+");
var gravVec = new b2Vec2(0, 0);
var world = new b2World(gravVec);
var staticBody = world.CreateBody(new b2BodyDef());
// Walls
var topWallShape = new b2EdgeShape();
topWallShape.Set(new b2Vec2(0, 0), new b2Vec2(160, 0));
var topWallFix = new b2FixtureDef();
topWallFix.set_shape(topWallShape);
staticBody.CreateFixture(topWallFix);
var bottomWallShape = new b2EdgeShape();
bottomWallShape.Set(new b2Vec2(0, 90), new b2Vec2(160, 90));
var bottomWallFix = new b2FixtureDef();
bottomWallFix.set_shape(bottomWallShape);
staticBody.CreateFixture(bottomWallFix);

// Game logic

// Game setup

var puckBodyDef = new b2BodyDef();
puckBodyDef.set_type(b2_dynamicBody);
puckBodyDef.set_position(80, 45);
var puckBody = world.CreateBody(puckBodyDef);
var puckShape = new b2CircleShape();
puckShape.set_m_radius(10);
puckBody.CreateFixture(puckShape, 1);

window.setInterval(function(){update();}, 1000/FPS);

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
	
	// Draw puck
	var pos = puckBody.get_position();
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = '#ffffff';
	context.fill();
}



// Utility classes & functions

function coordToPixels(coord) {
	return coord * W / 160;
}
