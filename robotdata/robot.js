// In here, you'll find functions and nothing else
function pixel8(image, x, y, w, h) {
	"use strict";

	// Image must be an image, canvas, or video
	// For videos: Pixel data of the currently displayed frame will be extracted
	// For canvases: Why are you using this?
	if (!image.tagName || image.tagName !== "IMG" && image.tagName !== "VIDEO" && image.tagName !== "CANVAS") {
		throw new TypeError("first argument must be image, video, or canvas context.");
	}

	// Defaults for x-offset, y-offset, width, and height values
	if (typeof x !== 'number') x = 0;
	if (typeof y !== 'number') y = 0;
	if (typeof w !== 'number') w = image.width;
	if (typeof h !== 'number') h = image.height;

	// For our friend Internet Explorer, FlashCanvas is supported
	// ExplorerCanvas does not support the getImageData function
	var canvas = document.createElement('canvas');
	if (window.FlashCanvas) FlashCanvas.initElement(canvas);
	if (canvas.getContext) var ctx = canvas.getContext('2d');
	else return;

	// Draw the image/canvas/video and return a CanvasPixelArray of pixel data
	// Image must be from the same origin! Use a server-side proxy if you need cross-domain resources.
	// Like this one: http://benalman.com/projects/php-simple-proxy/
	// See https://developer.mozilla.org/en-US/docs/HTML/Canvas/Pixel_manipulation_with_canvas
	// to find out how to get specific data from the array
	// Or just use the pixel8-provided methods below
	ctx.drawImage(image, x, y);
	var _data = ctx.getImageData(0, 0, w, h)
	var data = _data.data;
	data.width = _data.width;
	data.height = _data.height;
	
	// Returns {red, green, blue, alpha} object of a single specified pixel
	// or sets the specified pixel.
	data.pixelAt = function (x, y, set) {
		var i = y * this.width * 4 + x * 4;

		if (set) {
			this[i] = set.red;
			this[i + 1] = set.green;
			this[i + 2] = set.blue;
			this[i + 3] = set.alpha;
		} else return {
			red: this[i],
			green: this[i + 1],
			blue: this[i + 2],
			alpha: this[i + 3]
		};
	};

	// Draws the pixel data into a canvas
	data.draw = function(ctx, x, y) {
		ctx.putImageData(_data, x, y);
	};

	return data;
} // pixel8 Import is what this is, thanks to them for making this possible, provided I can figure out how it works
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); }
function drawBackground(xOffset, yOffset, imageX, imageY) {
	var bgWide = (c.width / imageX) + 1
	var bgTall = (c.height / imageY) + 1
	var bg = bgWide * bgTall
	var loops = 0
	while (loops != bg) {
		ctx.drawImage(background,  ((loops % bgWide) * imageX) - xOffset, (Math.floor(loops / bgWide) * imageY) - yOffset)
		loops = loops + 1
	}
}
function showImage(x,y,sprite) {
	var pic = new Image(1000,1000)
	pic.src = sprite
	ctx.drawImage(pic,x,y);
}
// And that ends the functions!  Now you see variable definition and the laws of physics
var robot = {}, camera = {}, kitty = {}, backdrop = {}, background = new Image(32,32), block = {}
robot.gravity = 6
robot.xpos = 88
robot.ypos = 72
camera.xpos = 0
camera.ypos = 0
kitty.xpos = 224
kitty.ypos = 48
robot.landed = 0
robot.xvol = 0
robot.yvol = 0
robot.shootdelay = -1 // Both shootdelay and airjump are -1 so that they're disabled until you get their upgrades
robot.airjump = -1
kitty.got = 0 // If this is ever 1, you have successfully won the game. Good job! (Unless you cheated)
kitty.frame = 0
kitty.skin = 1
robot.skin = 1
kitty.pose = 1
backdrop.skin = 1
background.src = "robotdata/background/" + backdrop.skin + ".png"
block.number = 8 // This exists for the sole purpose of knowing how many blocks you need to check for collision, so incrument this every time a new block is detected
block.xpos = [80,96,112,128,144,160,64,48,32,16,16,16,16,16,32,48,176,192,192,208,208,224,224,240,240,256,256,256,256,256,256,256,224,16,16,0,0,0,0,0,0,0] // 33
block.ypos = [96,96,96,96,96,96,96,80,80,64,48,32,96,80,96,96,96,96,80,80,96,96,80,80,96,96,80,64,48,32,16,0,64,16,0,0,16,32,48,64,80,96] // 33
block.skin  = [1,1,1,1,1,1,6,6,6,6,6,6,6,6,6,6,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,11,6,6,6,6,6,6,6,6,6] // 35
block.number = block.skin.length // Please make an auto-detect for the shortest length, thanks future me
robot.jumper = false
robot.gun = false
robot.dash = false
robot.highjump = false
robot.laser = false
robot.airgun = false // You can always shoot in the air, I just needed a way to say this
tic = false
pressedKeys = []
droptic = 3
window.addEventListener("keydown",
    function(e){
        pressedKeys[e.keyCode] = true;
        checkCombinations(e);
    },
false);

window.addEventListener('keyup',
    function(e){
        pressedKeys[e.keyCode] = false;
    },
false);
function checkCombinations(e){
    if(pressedKeys["a".charCodeAt(0)] && e.ctrlKey){
        alert("You're not allowed to mark all content!");
        e.preventDefault();
    }
}
// Although chechTouch() has no uses on it's own and is kinda limited, it has its uses when checking for touch damage
function checkTouch(thing1x,thing1y,thing2x,thing2y,wide1,wide2,tall1,tall2) { // Noting my potential overusage of comments
	if (wide1 !== null && wide2 !== null) { // Checks if wide is actually an existant variable in the equation.  If it isn't, it won't be bothered checking tall.
		if (tall1 !== null && tall2 !== null) { // If tall exists, then make a hitbox based on that, and rooted in the topleft corner.  Otherwise, make it square instead.
			// Check if if the virtual rectangle made is within the other virtual rectangle.  Both have to be rectangles, also.
		if (thing1x < thing2x + wide2 &&
			thing1x + wide1 > thing2x &&
			thing1y < thing2y + tall2 &&
			thing1y + tall1 > thing2y) {
			return true} else {return false}
		} else {
			// Check if the square exists. I mean are touching.
		if (thing1x < thing2x + wide2 &&
			thing1x + wide1 > thing2x &&
			thing1y < thing2y + wide2 &&
			thing1y + 16 > wide2) {
			return true} else {return false}
		}
	} else {
		// Check if the 16x16 square is within the other.  Use thing.x and thing.y to check where they are.
		if (thing1x < thing2x + 16 &&
			thing1x + 16 > thing2x &&
			thing1y < thing2y + 16 &&
			thing1y + 16 > thing2y) {
			return true
		} else {return false}
	}
}
/* Leaving this here for example usage...
if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.y + rect1.height > rect2.y) {
    // collision detected!
} Hopefully I can figure this out */
// applyPhysics() was actually gonna be a "Hey, make this thing obey the laws of physics this frame" sorta thing, but I decided otherwise because not everything needs velocity
function applyPhysics() {
	robot.landed = 0
	var loops = 0
	while (loops != block.number) {
		if (checkTouch(robot.xpos, robot.ypos + 2, block.xpos[loops], block.ypos[loops],16,16,16,16) && robot.yvol != -10) {
			robot.landed = 1
			if (checkTouch(robot.xpos, robot.ypos + 2, block.xpos[loops], block.ypos[loops],16,16,16,16)
			&& checkTouch(robot.xpos, robot.ypos, block.xpos[loops], block.ypos[loops],16,16,16,16)) {
				robot.ypos = robot.ypos - 1
			}
		} loops = loops + 1
	}if (droptic == robot.gravity) {
	if (robot.landed == 1 && robot.yvol != -10) {
		robot.yvol = 0}
	if (robot.landed == 0) {
		robot.yvol = robot.yvol + 1}
		droptic = 0
	} else if (droptic != robot.gravity) { // Same thing the game does to make it run at 30 fps.
		droptic = droptic + 1}
	if (checkTouch(robot.xpos,robot.ypos,kitty.xpos,kitty.ypos, 16,16,16,16)) {
		if (kitty.got != 1) {
			console.log("Robot Got Kitty!"); }
		kitty.got = 1 
		robot.xvol = 0
		robot.yvol = 0}
	if (robot.landed == 1) {
		robot.yvol = 0
	} else {
		robot.yvol = robot.yvol + 1
	}
	robot.xpos = robot.xpos + robot.xvol
	robot.ypos = robot.ypos + robot.yvol
}
function drawBlocks(offsetX, offsetY) {
	var loops = 0
	var ground = []
	while (loops != block.number) {
		ground[loops] = new Image(16,16)
		ground[loops].src = "robotdata/ground/" + block.skin[loops] +".png"
		ctx.drawImage(ground[loops],block.xpos[loops] - offsetX, block.ypos[loops] - offsetY)
		loops = loops + 1
	}
}
var c = document.getElementById("rwkspace");
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false
var bot = new Image(20,32);
bot.src = "robotdata/robot/1/stand.png"
ctx.drawImage(bot,robot.xpos - camera.xpos,robot.ypos - camera.ypos);
var music1 = new Audio("robotdata/music/startrack.ogg");
music1.loop = true
var music2 = new Audio("robotdata/music/midtrack.ogg");
music2.loop = true
var titletheme = new Audio("robotdata/music/titletheme.ogg");
titletheme.loop = true
var cat = new Image(32,32);
cat.src = "robotdata/kitty/1/2.png"
ctx.drawImage(cat,kitty.xpos - camera.xpos,kitty.ypos - camera.ypos);
function gameLoop() {// Tics process order is Inputs, Physics, Rendering.
	if (tic == false) { // Forces the game to run at 30 FPS instead of 60.  Helps slightly on ancient chromebooks.
		tic = true
	} else if (tic == true) {
		var loops = 0
		if (pressedKeys[39] == true) { // Now turn to the right!
			if (robot.xvol < 3) {
				robot.xvol = robot.xvol + 1
			}
		} else if (pressedKeys[37] == true) { // Now turn to the left!
			if (robot.xvol > -3 ) {
				robot.xvol = robot.xvol - 1
			}
		} else {
			if (robot.xvol > 0) { // 
				robot.xvol = robot.xvol - 1
			} else if (robot.xvol < 0) {
				robot.xvol = robot.xvol + 1
			}
		}
		if (pressedKeys[32] == true | pressedKeys[90] == true) {
			if (robot.landed == true) {
				robot.yvol = -10
				robot.landed = false
			}
		}
		applyPhysics();
		ctx.clearRect(0, 0, c.width, c.height);
		drawBackground(camera.xpos % 32,camera.ypos % 32,32,32);
		drawBlocks(camera.xpos, camera.ypos)
		ctx.drawImage(cat,kitty.xpos - camera.xpos,kitty.ypos - camera.ypos);
		ctx.drawImage(bot,Math.round(robot.xpos) - camera.xpos,Math.round(robot.ypos) - camera.ypos);
		kitty.frame = kitty.frame + 1
		if (kitty.frame === 20) {
			if (kitty.pose == 1) {
				cat.src = "robotdata/kitty/" + kitty.skin + "/2.png"
				kitty.pose = 2
			} else if (kitty.pose == 2) {
				cat.src = "robotdata/kitty/" + kitty.skin + "/1.png"
				kitty.pose = 3
			} else if (kitty.pose == 3) {
				cat.src = "robotdata/kitty/" + kitty.skin + "/3.png"
				kitty.pose = 4
			} else { cat.src = "robotdata/kitty/" + kitty.skin + "/1.png", kitty.pose = 1 }
			kitty.frame = 0
		}
		tic = false }
	window.requestAnimationFrame(gameLoop);
}
music1.play();
var lvimg = document.getElementById("level")
// var lvl = pixel8(lvimg)
gameLoop(); // Start the game loop and get the game running!