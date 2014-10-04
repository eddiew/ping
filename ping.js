// Canvas initialization

var W = 160, H = 90, CW, CH, R = W / H;
var FPS = 60;
var PADDLE_HEIGHT = 15;
var PADDLE_WIDTH = 3;
var PADDLE_SPEED = 100;
var PUCK_RADIUS = 5;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var maxW = window.innerWidth, maxH = window.innerHeight;
if (maxW / maxH > 16 / 9) {
	context.canvas.width = maxH * R;
	context.canvas.height = maxH;
}
else {
	context.canvas.width = maxW;
	context.canvas.height = maxW / R;
}
CW = context.canvas.width;
CH = context.canvas.height;
canvas.style.width = CW;
canvas.style.height = CH;

// Box2d initialization

using(Box2D, "b2.+");
var gravVec = new b2Vec2(0, 0);
var world = new b2World(gravVec);
var staticBody = world.CreateBody(new b2BodyDef());

// Box2d debug drawing
var debugDraw = getCanvasDebugDraw();
debugDraw.SetFlags(e_shapeBit);
world.SetDebugDraw(debugDraw);

// Game setup

// Variable initialization

// Walls
var topWallShape = new b2EdgeShape();
topWallShape.Set(new b2Vec2(0, 0), new b2Vec2(W, 0));
var topWallFix = new b2FixtureDef();
topWallFix.set_shape(topWallShape);
staticBody.CreateFixture(topWallFix);
var bottomWallShape = new b2EdgeShape();
bottomWallShape.Set(new b2Vec2(0, H), new b2Vec2(W, H));
var bottomWallFix = new b2FixtureDef();
bottomWallFix.set_shape(bottomWallShape);
staticBody.CreateFixture(bottomWallFix);

// Puck setup
var puckBodyDef = new b2BodyDef();
puckBodyDef.set_type(b2_dynamicBody);
puckBodyDef.set_position(new b2Vec2(W / 2, H / 2));
var puckBody = world.CreateBody(puckBodyDef);
var puckFixtureDef = new b2FixtureDef();
puckFixtureDef.set_restitution(1);
var puckShape = new b2CircleShape();
puckShape.set_m_radius(PUCK_RADIUS);
puckFixtureDef.set_shape(puckShape);
puckBody.CreateFixture(puckFixtureDef);
puckBody.SetLinearVelocity(new b2Vec2(0, 100));

// Paddle setup
var paddleVerts = [
	new b2Vec2(0, 0),
	new b2Vec2(PADDLE_WIDTH, 0),
	new b2Vec2(PADDLE_WIDTH, PADDLE_HEIGHT),
	new b2Vec2(0, PADDLE_HEIGHT),
];
var paddleShape = createPolygonShape(paddleVerts);
var padFixtureDef = new b2FixtureDef();
padFixtureDef.set_shape(paddleShape);
var lPadBodyDef = new b2BodyDef();
lPadBodyDef.set_type(b2_kinematicBody);
lPadBodyDef.set_position(new b2Vec2(0, (H - PADDLE_HEIGHT) / 2));
var lPadBody = world.CreateBody(lPadBodyDef);
lPadBody.CreateFixture(padFixtureDef);

var rPadBodyDef = new b2BodyDef();
rPadBodyDef.set_type(b2_kinematicBody);
rPadBodyDef.set_position(new b2Vec2(W - PADDLE_WIDTH, (H - PADDLE_HEIGHT) / 2));
var rPadBody = world.CreateBody(rPadBodyDef);
rPadBody.CreateFixture(padFixtureDef);

// Game logic

var lastInterval = (new Date()).getTime();
window.setInterval(function(){update();}, 1000/FPS);


document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38:
			e.preventDefault();
			rPadBody.SetLinearVelocity(new b2Vec2(0, -PADDLE_SPEED));
			break;
		case 40:
			e.preventDefault();
			rPadBody.SetLinearVelocity(new b2Vec2(0, PADDLE_SPEED));
			break;
		case 87:
			lPadBody.SetLinearVelocity(new b2Vec2(0, -PADDLE_SPEED));
			break;
		case 83:
			lPadBody.SetLinearVelocity(new b2Vec2(0, PADDLE_SPEED));
			break;
	}
};

document.onkeyup = function(e) {
	switch (e.keyCode) {
		case 38:
			rPadBody.SetLinearVelocity(new b2Vec2(0, 0));
			break;
		case 40:
			rPadBody.SetLinearVelocity(new b2Vec2(0, 0));
			break;
		case 87:
			lPadBody.SetLinearVelocity(new b2Vec2(0, 0));
			break;
		case 83:
			lPadBody.SetLinearVelocity(new b2Vec2(0, 0));
			break;
	}
};

function update()
{
	var currentTime = Date.now();
	var delta = currentTime - lastInterval;
	lastInterval = currentTime;
	
	getInput(delta);
	// do physics
	world.Step(1/FPS, 8, 3);
	draw(delta);
}

function getInput(delta)
{

}

function draw(delta)
{
	console.log(delta);
	context.fillStyle = "#000000";
	context.fillRect(0, 0, CW, CH);
	
	// // Draw puck
	// var pos = puckBody.GetPosition();
	// context.beginPath();
	// // context.arc(80, 80, PUCK_RADIUS, 0, 2 * Math.PI, false);
	// context.arc(coordToPixels(pos.get_x()), coordToPixels(pos.get_y()), PUCK_RADIUS, 0, 2 * Math.PI, false);
	// context.fillStyle = '#ffffff';
	// context.fill();
	
	world.DrawDebugData();
}

// Utility classes & functions

function coordToPixels(coord) {
	return coord * CW / W;
}
