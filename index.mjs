console.log("Running");


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let showClickAreas = true;

let transitionTimeRemaining = 0;

let mouseX = 0;
let mouseY = 0;


let gateClosed = true;

// TODO: Make a PAGE class
// TODO: In the page class, make the 'imageURL' a getter that uses game info
const pages = {
    "start": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0000.png";
            } else {
                return "./images/0028.png";
            }
        },
        clickAreas: [{
            x: 244,
            y: 106,
            width: 200,
            height: 120,
            cursor: "n-resize",
            click: () => {
                transitionToPage("gate");
            },
        },{
            x: 0,
            y: HEIGHT - 80,
            width: WIDTH,
            height: 80,
            cursor: "s-resize",
            click: () => {
                transitionToPage("start-reverse");
            },
        },],
    },
    "start-reverse": {
        getImageURL: () => "./images/0001.png",
        clickAreas: [{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "s-resize",
            click: () => {
                transitionToPage("start");
            },
        },],
    },

    // main gate entrance
    "gate": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0002.png";
            } else {
                return "./images/0030.png";
            }
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("gate-left");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("gate-right");
            },
        },],
    },
    "gate-left": {
        getImageURL: () => "./images/0003.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("gate-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("gate");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 200,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("toll-outside");
            },
        },],
    },
    "gate-reverse": {
        getImageURL: () => "./images/0004.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("gate-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("gate-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("start-reverse");
            },
        },],
    },
    "gate-right": {
        getImageURL: () => "./images/0005.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("gate");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("gate-reverse");
            },
        },],
    },

    // Towards toll box
    "toll-outside": {
        getImageURL: () => "./images/0006.png",
        clickAreas: [{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "s-resize",
            click: () => {
                transitionToPage("toll-outside-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-outside-right");
            },
        },],
    },
    "toll-outside-right": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0007.png";
            } else {
                return "./images/0035.png";
            }
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-outside");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-outside-reverse");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 200,
            height: HEIGHT,
            cursor: "grab",
            click: () => {
                // TODO: Sound effect of door opening
                transitionToPage("toll-outside-right-open");
            },
        },],
    },
    "toll-outside-right-open": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0021.png";
            } else {
                return "./images/0049.png";
            }
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-outside");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-outside-reverse");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 200,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("toll-inside");
            },
        },],
    },
    "toll-outside-reverse": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0008.png";
            } else {
                return "./images/0036.png";
            }
        },
        clickAreas: [{
            x: 0,
            y: HEIGHT - 80,
            width: WIDTH,
            height: 80,
            cursor: "s-resize",
            click: () => {
                transitionToPage("toll-outside");
            },
        },{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-outside-right");
            },
        },{
            x: 180,
            y: 106,
            width: 250,
            height: 120,
            cursor: "n-resize",
            click: () => {
                transitionToPage("gate-right");
            },
        },],
    },


    // Inside of the toll booth
    "toll-inside": {
        getImageURL: () => {
            if (gateClosed) {
                return "./images/0009.png";
            } else {
                return "./images/0037.png";
            }
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside-left");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside-right");
            },
        },{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "s-resize",
            click: () => {
                transitionToPage("toll-inside-down");
            },
        },],
    },
    "toll-inside-left": {
        getImageURL: () => "./images/0010.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside");
            },
        },],
    },
    "toll-inside-reverse": {
        getImageURL: () => "./images/0012.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "grab",
            click: () => {
                // TODO: Sound of door opening
                transitionToPage("toll-inside-reverse-open");
            },
        },],
    },
    "toll-inside-reverse-open": {
        getImageURL: () => "./images/0026.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("toll-outside");
            },
        },],
    },
    "toll-inside-right": {
        getImageURL: () => "./images/0011.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside-reverse");
            },
        },],
    },
    "toll-inside-down": {
        getImageURL: () => "./images/0013.png",
        clickAreas: [{
            x: 0,
            y: 0,
            width: WIDTH,
            height: 80,
            cursor: "n-resize",
            click: () => {
                transitionToPage("toll-inside");
            },
        },{
            x: 240,
            y: 135,
            width: 55,
            height: 45,
            cursor: "grab",
            click: () => {
                gateClosed = !gateClosed;
                // TODO Play audio of gate moving
            },
        },],
    },
};



let currentPage = pages["start"];

// Render out the current frame
async function drawFrame(clickAreaOverride = undefined) {

    // Override the show click area if necessary
    const internalShowClickAreas = clickAreaOverride != undefined ? clickAreaOverride : showClickAreas;

    // Make sure the image is loaded (before clearing the screen)
    const backgroundImage = await imageLib.getOrAddImage(currentPage.getImageURL());

    // Clear the screen
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    // Draw the background
    ctx.drawImage(backgroundImage, 0, 0);

    // ctx.fillStyle = "#F00";
    // ctx.fillRect(0,0,3,3);
    // ctx.fillStyle = "#00F";
    // ctx.fillRect(mouseX,mouseY,3,3);

    if (internalShowClickAreas) {
        // Render all click areas
        for (let clickArea of currentPage.clickAreas) {
            if ((mouseX > clickArea.x) && (mouseX < (clickArea.width + clickArea.x)) &&
                (mouseY > clickArea.y) && (mouseY < (clickArea.height + clickArea.y))) {
                    ctx.fillStyle = "rgba(255,200,100,0.2)";
            } else {
                ctx.fillStyle = "rgba(150,150,100,0.2)";
            }

            ctx.fillRect(clickArea.x, clickArea.y, clickArea.width, clickArea.height);
        }
    }
}

// Sets the cursor style on the canvas
// https://www.w3schools.com/cssref/tryit.php?filename=trycss_cursor
function setCursorStyle() {
    let cursorStyle = "not-allowed";

    for (let clickArea of currentPage.clickAreas) {
        if ((mouseX > clickArea.x) && (mouseX < (clickArea.width + clickArea.x)) &&
            (mouseY > clickArea.y) && (mouseY < (clickArea.height + clickArea.y)))
        {
            cursorStyle = clickArea.cursor;
        }
    }

    canvas.style.cursor = cursorStyle;
}




// Transitions to a new page
async function transitionToPage(pageID) {

    // First, render without click areas
    await drawFrame(false);

    // Set the new page
    currentPage = pages[pageID];

    // Set the cursor to waiting
    canvas.style.cursor = "wait";

    // Run the animation
    await transitionAnimationToImage(currentPage.getImageURL());

    // Finally, set up the game to get going again
    drawFrame();
    setCursorStyle();
}




const IMAGE_BIT_SIZE = 2;
const TRANSITION_TIME_MS = 200;

async function transitionAnimationToImage(imageURL) {
    transitionTimeRemaining = TRANSITION_TIME_MS;
    const imageToDraw = await imageLib.getOrAddImage(imageURL);

    let previousTime = await animationPromise();

    let transitionImageBitsRemaining = [];


    for (let x = 0; x < WIDTH; x += IMAGE_BIT_SIZE) {
        for (let y = 0; y < WIDTH; y += IMAGE_BIT_SIZE) {
            transitionImageBitsRemaining.push([x,y]);
        }
    }

    const totalImageBits = transitionImageBitsRemaining.length;
    shuffleArray(transitionImageBitsRemaining);

    // Continue drawing until the animation is done
    while (transitionTimeRemaining > 0) {
        const timeSincePageLoad = await animationPromise();
        const timePassed = timeSincePageLoad - previousTime;
        transitionTimeRemaining -= timePassed;
        previousTime = timeSincePageLoad;

        while (transitionImageBitsRemaining.length &&
            ((transitionImageBitsRemaining.length / totalImageBits) >
             (transitionTimeRemaining / TRANSITION_TIME_MS))) {
            const bitToDraw = transitionImageBitsRemaining.pop();
            const x = bitToDraw[0];
            const y = bitToDraw[1];

            ctx.drawImage(imageToDraw,
                x, y, IMAGE_BIT_SIZE, IMAGE_BIT_SIZE,
                x, y, IMAGE_BIT_SIZE, IMAGE_BIT_SIZE);

        }
        console.log(transitionTimeRemaining);
    }

    // Just to keep things clean
    transitionTimeRemaining = 0;
}















// Input handler

canvas.addEventListener("mousemove", (e) => {
    if (transitionTimeRemaining > 0) return;
    updateMousePositionFromEvent(e);

    drawFrame();
    setCursorStyle();
});

canvas.addEventListener("mouseleave", (e) => {
    if (transitionTimeRemaining > 0) return;
    mouseX = -100;
    mouseY = -100;
    drawFrame();
    setCursorStyle();
});

canvas.addEventListener("click", (e) => {
    if (transitionTimeRemaining > 0) return;
    updateMousePositionFromEvent(e);

    let clickedArea = null;

    for (let clickArea of currentPage.clickAreas) {
        if ((mouseX > clickArea.x) && (mouseX < (clickArea.width + clickArea.x)) &&
            (mouseY > clickArea.y) && (mouseY < (clickArea.height + clickArea.y)))
        {
            clickedArea = clickArea;
        }
    }
    if (clickedArea) {
        clickedArea.click();
    }
});


// Uses a screen event to update the local mouseX/mouseY
function updateMousePositionFromEvent(e) {
    const rawX = e.offsetX;
    const rawY = e.offsetY;
    const canvasBoundingRect = canvas.getBoundingClientRect();

    const normalizedX = rawX / canvasBoundingRect.width;
    const normalizedY = rawY / canvasBoundingRect.height;

    mouseX = Math.floor(normalizedX * WIDTH);
    mouseY = Math.floor(normalizedY * HEIGHT);
    console.log({mouseX, mouseY});
}









// A place that handles loading and caching images
class ImageLibrary {

    images = {};

    constructor(startingImage) {
        this.images = [];

    }

    // Promises to return an image
    getOrAddImage(imageURL) {

        // Make a promise to return the image
        const imageReturnPromise = new Promise((resolve, reject) => {
            if (imageURL in this.images) {
                resolve(this.images[imageURL]);
            } else {
                // Setup data for the new image
                const newImage = new Image();

                // Add the image to the list and return it
                newImage.addEventListener("load", (e) => {
                    this.images[imageURL] = newImage;
                    console.log('downloadImage loaded');
                    // ctx.drawImage(downloadingImage, 0, 0);
                    resolve(this.images[imageURL]);
                });

                // Handle if it errors out
                newImage.addEventListener("error", (e) => {
                    console.error(e);
                    console.error("Image failed to load!");
                    console.error(imageURL);
                    reject();
                });

                // Finally, set the URL so it can start loading
                newImage.src = imageURL;
            }
        });

        return imageReturnPromise;
    }
}












function sleepPromise(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function animationPromise() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}














const imageLib = new ImageLibrary();
console.log(imageLib);
const foo = await imageLib.getOrAddImage("images/0000.png");
console.log(foo);

drawFrame();
