// This here is what's known as the loader.  Makes sense when you look at the name.
// This script just as important as robot.js, since this script makes sure that the other one actually works as intended, assets and all.
// This reads level.png and takes all the everything for sprites and puts them in the page (hidden) so that you can actually see what's going on ingame.
// Also, just so you know, the whole game needs to have the id "rwkspace" so that it'll actually work.  I have no idea how to obtain the id of an element's parent, so in the mean time you have to do as I ask.
// Now, if you'll need me, I'll be in the back.

function preloadImage(url, label) { // Shamelessly stolen from someone by the way
    var img=new Image();
    img.src=url;
    img.id=label;
    document.getElementById('rwkspace').appendChild(img) }
preloadImage("cat2.png");


// Gah! You found me again! 
// Exihbit A: Brick Joke