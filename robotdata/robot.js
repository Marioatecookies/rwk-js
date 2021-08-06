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
		ctx.drawImage(background,  ((loops % bgWide) * imageX) - xOffset,(Math.floor(loops / bgWide) * imageY) - yOffset)
		loops = loops + 1
	}
}
function showImage(x,y,sprite) {
	var pic = new Image(1000,1000)
	pic.src = sprite
	ctx.drawImage(pic,x,y);
}
// And that ends the functions!  Now you see variable definition and the laws of physics
var robot = {}, camera = {}, kitty = {}, backdrop = {}, background = new Image(32,32), block = {}, level = {}
robot.gravity = 6
robot.xpos = 160
robot.ypos = 1088
robot.vxpos = robot.xpos // Visual X position
robot.vypos = robot.ypos // Visual Y position
robot.oxpos = robot.xpos // Last tick's X position
robot.oypos = robot.ypos // Last tick's Y position
camera.xpos = robot.xpos - 320
camera.ypos = robot.ypos - 240
camera.txpos = robot.xpos - 320
camera.typos = robot.ypos - 240
camera.speed = 32
camera.xrunahead = 16
camera.yrunahead = 8
kitty.xpos = 224
kitty.ypos = 48
robot.landed = 0
robot.xvol = 0
robot.yvol = 0
robot.checkx = robot.xpos
robot.checky = robot.ypos
robot.shootdelay = -1 // Both shootdelay and airjump are -1 so that they're disabled until you get their upgrades
robot.airjump = -1
kitty.got = 0 // If this is ever 1, you have successfully won the game. Good job! (Unless you cheated)
kitty.frame = 0
kitty.skin = 1
robot.skin = 1
kitty.pose = 1
backdrop.skin = 1
background.src = "robotdata/background/" + backdrop.skin + ".png"
block.number = 1 // This exists for the sole purpose of knowing how many blocks you need to check for collision, so incrument this every time a new block is detected
block.xpos = [160,144,176,128,128,128,128,128,128,144,160,176] // 1
block.ypos = [1104,1104,1104,1088,1072,1056,1104,1040,1040,1040,1040,1040] // 1
block.skin  = [1,1,1,1,1,1,1,1,1,1,1,1] // 1
block.number = block.skin.length // Please make an auto-detect for the shortest length, thanks future me
level.chunks = [] // Level chunks should be 5x5 (80x80 in pixels) big.
level.chunks[0] = { // Remember, to get an object from an array, do array[#].element
xpos:6,
ypos:0,
blocks:[ // x = x position, y = y position, s = skin
	{x:512,y:0,s:0},
	{x:496,y:0,s:0},
	{x:528,y:0,s:0}]
} // Random note: I've probably killed like 20 fruit flies today alone, just stop BUGGING me.
level.getChunk = function(x, y, returnId) {
	var loops = 0
	var worker = {}
	var worker2 = level.chunks[length]
	while (loops != worker2) {
		worker = level.chunks[loops]
		if (worker.xpos == x
		&& worker.ypos == y) {
			if (returnId == false || returnId == undefined || returnId == null) 
			{return worker
			} else {return loops}
		} loops = loops + 1
	}console.log("I can't find the chunk at " + x + ", " + y + "! Does it even exist?");
}
level.getBlock = function(x, y, id) {
	// Put an algorithm here please, thanks
}
robot.jumper = false
robot.gun = false
robot.dash = false
robot.highjump = false
robot.laser = false
robot.airgun = false // You can always shoot in the air, I just needed a way to say this
tic = 2
pressedKeys = []
droptic = 0
debugcheats = {list:{
	resetCamera:{description:"Moves the camera to 0,0 on the map. If given a location, however, it'll move there instead."}
}
}
/* debugcheats.offsetBlocks = function(x,y,tile) {
	if (tile != null) {
	block.xpos[tile] = block.xpos[tile] + x
	block.ypos[tile] = block.ypos[tile] + y
	} else {
	var loops = 0
	while (loops != block.xpos[length]) {
		block.xpos[loops] = block.xpos[loops] + x
		loops = loops++
	} loops = 0
	while (loops != block.ypos[length]) {
		block.ypos[loops] = block.ypos[loops] + y
		loops = loops++
	} 
}} Commenting this out because the world is getting chunky.  Also because it froze the game on use. */
debugcheats.resetCamera = function(x,y) {
	if (x = null) {
		camera.txpos = 0
		camera.xpos = 0
	} else {
		camera.txpos = x
		camera.xpos = x
	} if (y = null) {
		camera.typos = 0
		camera.ypos = 0
	} else {
		camera.typos = y
		camera.ypos = y}
}
var soundfx = {}

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
	robot.oxpos = robot.xpos
	robot.oypos = robot.ypos
	// console.log(robot.yvol) Debugging only!
	var loops = 0
	while (loops != block.number) {
		if (checkTouch(robot.xpos, robot.ypos + 2, block.xpos[loops], block.ypos[loops],16,16,16,16) && robot.yvol != -10) {
			robot.landed = 1
			if (checkTouch(robot.xpos, robot.ypos + 2, block.xpos[loops], block.ypos[loops],16,16,16,16)
			&& checkTouch(robot.xpos, robot.ypos, block.xpos[loops], block.ypos[loops],16,16,16,16)) {
				robot.ypos = robot.ypos - 1
			}
		} loops = loops + 1
	} droptic = droptic++
	if (robot.gravity == droptic && robot.landed == 1) {
		robot.yvol = robot.yvol++
		droptic = 0
	}
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
	} var worker
	var loops = 0
	/*if (robot.xvol > 0) {
		while (worker != robot.xvol) {
			robot.xpos = robot.xpos++
			worker = worker++
			while (loops != block.number) {
				if (checkTouch(robot.xpos, robot.ypos, block.xpos[loops], block.ypos[loops],16,16,16,16)) {
					worker = robot.xvol}}
		}
	}*/
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
function gameLoop() {// Tics process order is Inputs, Loading, Physics, Camera, Rendering.
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
		// Add loading logic here, for optimization purposes
		robot.vxpos = robot.vxpos + ((robot.xpos - robot.oxpos) / 3)
		robot.vypos = robot.vypos + ((robot.ypos - robot.oypos) / 3)
		if (tic == 2) {
			tic = 0
			applyPhysics();
			robot.vxpos = robot.oxpos
			robot.vypos = robot.oypos
		} else {tic = tic + 1}
		camera.txpos = camera.txpos + ((((robot.vxpos + (robot.xvol * camera.xrunahead)) - 328) - camera.txpos) / camera.speed)
		camera.typos = camera.typos + ((((robot.vypos + (robot.yvol * camera.yrunahead)) - 240) - camera.typos) / camera.speed)
		camera.xpos = Math.round(camera.txpos)
		camera.ypos = Math.round(camera.typos)
		ctx.clearRect(0, 0, c.width, c.height);
		drawBackground(camera.xpos % 32,camera.ypos % 32,32,32);
		drawBlocks(camera.xpos, camera.ypos)
		ctx.drawImage(cat,kitty.xpos - camera.xpos,kitty.ypos - camera.ypos);
		ctx.drawImage(bot,Math.round(robot.vxpos - camera.xpos),Math.round(robot.vypos - camera.ypos));
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
	window.requestAnimationFrame(gameLoop);
}
music1.play();
var lvimg = document.getElementById("level")
// var lvl = pixel8(lvimg)
gameLoop(); // Start the game loop and get the game running!