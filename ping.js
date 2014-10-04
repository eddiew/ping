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

// Box2d debug drawing
var debugDraw = getCanvasDebugDraw();
debugDraw.SetFlags(e_shapeBit);
world.SetDebugDraw(debugDraw);

// Game logic

// Game setup

var PUCK_RADIUS = 10;

var puckBodyDef = new b2BodyDef();
puckBodyDef.set_type(b2_dynamicBody);
puckBodyDef.set_position(new b2Vec2(80, 45));
var puckBody = world.CreateBody(puckBodyDef);
var puckFixtureDef = new b2FixtureDef();
puckFixtureDef.set_restitution(1);
var puckShape = new b2CircleShape();
puckShape.set_m_radius(PUCK_RADIUS);
puckFixtureDef.set_shape(puckShape);
puckBody.CreateFixture(puckFixtureDef);
puckBody.SetLinearVelocity(new b2Vec2(0, 100));

// Paddle Set Up

var lPadY

window.setInterval(function(){update();}, 1000/FPS);

function update()
{
	getInput();
	// do physics
	world.Step(1/FPS, 8, 3);
	draw();
}

function getInput()
{
	document.onkeydown = function(e){
		switch (e.keyCode){
			case 38:
				break;
			case 40:
				break;
			case 87:
				break;
			case 83:
				break;
		}
	}
}

function draw()
{
	context.fillStyle = "#000000";
	context.fillRect(0, 0, W, H);
	
	// Draw puck
	var pos = puckBody.GetPosition();
	context.beginPath();
	// context.arc(80, 80, PUCK_RADIUS, 0, 2 * Math.PI, false);
	context.arc(coordToPixels(pos.get_x()), coordToPixels(pos.get_y()), PUCK_RADIUS, 0, 2 * Math.PI, false);
	context.fillStyle = '#ffffff';
	context.fill();
	
	//world.DrawDebugData();
}

// Utility classes & functions

function coordToPixels(coord) {
	return coord * W / 160;
}
