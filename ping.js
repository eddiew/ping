// Canvas initialization
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

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

// Dimension initialization
var W = 16, H = 9, CW, CH, R = W / H;
var FPS = 60;
var PADDLE_HEIGHT = 1.5;
var PADDLE_WIDTH = 0.3;
var PADDLE_SPEED = 10;
var PUCK_RADIUS = 0.5;

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

// variables for paddle movement
var keysPressed = {38: false, 40: false, 87: false, 83: false};

// Walls
var topWallShape = new b2EdgeShape();
topWallShape.Set(new b2Vec2(0, 0), new b2Vec2(W, 0));
var topWallFix = new b2FixtureDef();
topWallFix.set_shape(topWallShape);
topWallFix.set_restitution(1);
topWallFix.set_friction(0);
staticBody.CreateFixture(topWallFix);
var bottomWallShape = new b2EdgeShape();
bottomWallShape.Set(new b2Vec2(0, H), new b2Vec2(W, H));
var bottomWallFix = new b2FixtureDef();
bottomWallFix.set_shape(bottomWallShape);
bottomWallFix.set_restitution(1);
bottomWallFix.set_friction(0);
staticBody.CreateFixture(bottomWallFix);

// Puck setup
var puckBodyDef = new b2BodyDef();
puckBodyDef.set_type(b2_dynamicBody);
puckBodyDef.set_position(new b2Vec2(W / 2, H / 2));
var puckBody = world.CreateBody(puckBodyDef);
var puckFixtureDef = new b2FixtureDef();
puckFixtureDef.set_restitution(1);
puckFixtureDef.set_friction(0);
var puckShape = new b2CircleShape();
puckShape.set_m_radius(PUCK_RADIUS);
puckFixtureDef.set_shape(puckShape);
puckBody.CreateFixture(puckFixtureDef);
initPuckVelocity(puckBody);

// Paddle setup
var paddleVerts = [
	new b2Vec2(0, 0),
	new b2Vec2(PADDLE_WIDTH, 0),
	new b2Vec2(PADDLE_WIDTH, PADDLE_HEIGHT),
	new b2Vec2(0, PADDLE_HEIGHT),
];
var paddleShape = createPolygonShape(paddleVerts);
var padFixtureDef = new b2FixtureDef();
padFixtureDef.set_restitution(1);
padFixtureDef.set_friction(0);
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

var lastInterval = Date.now();

window.setInterval(function() {
	update();
}, 1000 / FPS);

document.onkeydown = function(e) {
	if (keysPressed.hasOwnProperty(e.keyCode)) {
		e.preventDefault();
		keysPressed[e.keyCode] = true;
	}
};

document.onkeyup = function(e) {
	if (keysPressed.hasOwnProperty(e.keyCode)) {
		keysPressed[e.keyCode] = false;
	}
};

function update()
{
	var currentTime = Date.now();
	var delta = currentTime - lastInterval;
	lastInterval = currentTime;
	
	processInput(delta);
	limitPaddles();
	// do physics
	world.Step(delta / 1000, 8, 3);
	draw(delta);
	checkVictory();
}

// Process user input to paddle movement
function processInput(delta)
{
	var rMove = keysPressed[40] - keysPressed[38];
	var lMove = keysPressed[83] - keysPressed[87];
	lPadBody.SetLinearVelocity(new b2Vec2(0, lMove * PADDLE_SPEED));
	rPadBody.SetLinearVelocity(new b2Vec2(0, rMove * PADDLE_SPEED));
}

// Keep paddles on screen
function limitPaddles() {
	var rPadY = rPadBody.GetPosition().get_y();
	var lPadY = lPadBody.GetPosition().get_y();
	// Left Paddle
	if (lPadY + PADDLE_HEIGHT >= H && lPadBody.GetLinearVelocity().get_y() > 0) {
		lPadBody.SetLinearVelocity(new b2Vec2(0, 0));
	}
	else if (lPadY <= 0 && lPadBody.GetLinearVelocity().get_y() < 0) {
		lPadBody.SetLinearVelocity(new b2Vec2(0, 0));
	}
	// Right Paddle
	if (rPadY + PADDLE_HEIGHT >= H && rPadBody.GetLinearVelocity().get_y() > 0) {
		rPadBody.SetLinearVelocity(new b2Vec2(0, 0));
	}
	else if (rPadY <= 0 && rPadBody.GetLinearVelocity().get_y() < 0) {
		rPadBody.SetLinearVelocity(new b2Vec2(0, 0));
	}
}

function draw(delta)
{
	// console.log(delta);
	context.fillStyle = "#000000";
	context.fillRect(0, 0, CW, CH);
	
	// Draw puck
	var puckPos = puckBody.GetPosition();
	context.beginPath();
	context.arc(coordToPixels(puckPos.get_x()), coordToPixels(puckPos.get_y()), coordToPixels(PUCK_RADIUS), 0, 2 * Math.PI);
	context.fillStyle = '#ffffff';
	context.fill();

	// Draw paddles
	var rPadPos = rPadBody.GetPosition();
	context.fillRect(coordToPixels(rPadPos.get_x()), coordToPixels(rPadPos.get_y()), coordToPixels(PADDLE_WIDTH), coordToPixels(PADDLE_HEIGHT));
	
	var lPadPos = lPadBody.GetPosition();
	context.fillRect(coordToPixels(lPadPos.get_x()), coordToPixels(lPadPos.get_y()), coordToPixels(PADDLE_WIDTH), coordToPixels(PADDLE_HEIGHT));
	
	// world.DrawDebugData();
}

function checkVictory() {
	var puckX = puckBody.GetPosition().get_x();
	if (puckX > W || puckX < 0) {
		// if (puckX > W) { // makes the ball move slowly after resets. why?
		//	alert('Player 1 wins!');
		// }
		// else {
		//	alert('Player 2 wins!');
		// }
		softReset();
	}
}

function softReset() {
	puckBody.SetTransform(new b2Vec2(W / 2, H / 2), 0);
	initPuckVelocity(puckBody);
}

// Utility classes & functions

function coordToPixels(coord) {
	return coord * CW / W;
}

function initPuckVelocity(puckBody) {
	switch(Math.floor(Math.random() * 4)) {
		case 0:
			puckBody.SetLinearVelocity(new b2Vec2(7 , 7));
			break;
		case 1:
			puckBody.SetLinearVelocity(new b2Vec2(-7 , 7));
			break;
		case 2:
			puckBody.SetLinearVelocity(new b2Vec2(-7 , -7));
			break;
		case 3:
			puckBody.SetLinearVelocity(new b2Vec2(7 , -7));
			break;
	}
}