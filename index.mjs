console.log("Running");


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const showClickAreasCheckbox = document.getElementById("checkbox-show-clickareas");
console.log(showClickAreasCheckbox);
showClickAreasCheckbox.addEventListener("change", (e) => {
    console.log(e.target.checked);
    showClickAreas = e.target.checked;
    if (!freezeInputs) {
        drawFrame();
    }
});

const audioFiles = {
    "outside-birds": new Audio("./sounds/outside-birds.mp3"),
    "door-wood-close": new Audio("./sounds/door-wood-close.mp3"),
    "door-wood-open": new Audio("./sounds/door-wood-open.mp3"),
    "motor-outside-gate": new Audio("./sounds/motor-outside-gate.mp3"),
    "button-large": new Audio("./sounds/button-large.mp3"),
    "button-small": new Audio("./sounds/button-small.mp3"),
    // "": new Audio("./sounds/.mp3"),
}

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// let gameState = "mainScreen";

let showClickAreas = false;

let freezeInputs = false;

let mouseX = 0;
let mouseY = 0;

let tollGateInput = [0,0,0];
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
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
            cursor: "alias",
            click: () => {
                transitionToPage("start-reverse");
            },
        },],
    },
    "start-reverse": {
        getImageURL: () => "./images/0001.png",
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "alias",
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
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
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 200,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                if (!gateClosed) {
                    transitionToPage("courtyard");
                }
            },
        },],
    },
    "gate-left": {
        getImageURL: () => "./images/0003.png",
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "alias",
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
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
            x: (WIDTH/2),
            y: 30,
            width: 120,
            height: HEIGHT - 30,
            cursor: "grab",
            click: () => {
                audioFiles["door-wood-open"].play();
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-outside");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-outside-reverse");
            },
        },{
            x: (WIDTH/2),
            y: 30,
            width: 120,
            height: HEIGHT - 30,
            cursor: "n-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-inside");
            },
        },{
            x: (WIDTH/2) - 120,
            y: 80,
            width: 110,
            height: HEIGHT - 80,
            cursor: "grab",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-outside-right");
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
        audio: {
            "outside-birds": {
                volume: 1.0,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: HEIGHT - 80,
            width: WIDTH,
            height: 80,
            cursor: "alias",
            click: () => {
                transitionToPage("toll-outside");
            },
        },{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
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
        audio: {
            "outside-birds": {
                volume: 0.3,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 120,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("toll-inside-left");
            },
        },{
            x: WIDTH - 120,
            y: 0,
            width: 120,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("toll-inside-right");
            },
        },{
            x: 130,
            y: HEIGHT - 120,
            width: WIDTH - 260,
            height: 120,
            cursor: "s-resize",
            click: () => {
                transitionToPage("toll-inside-down");
            },
        },],
    },
    "toll-inside-left": {
        getImageURL: () => "./images/0010.png",
        audio: {
            "outside-birds": {
                volume: 0.3,
                loop: true,
            },
        },
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
        audio: {
            "outside-birds": {
                volume: 0.3,
                loop: true,
            },
        },
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
                audioFiles["door-wood-open"].play();
                transitionToPage("toll-inside-reverse-open");
            },
        },],
    },
    "toll-inside-reverse-open": {
        getImageURL: () => "./images/0026.png",
        audio: {
            "outside-birds": {
                volume: 0.8,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-inside-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-inside-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                audioFiles["door-wood-close"].play();
                transitionToPage("toll-outside-reverse");
            },
        },],
    },
    "toll-inside-right": {
        getImageURL: () => "./images/0011.png",
        audio: {
            "outside-birds": {
                volume: 0.3,
                loop: true,
            },
        },
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
        audio: {
            "outside-birds": {
                volume: 0.2,
                loop: true,
            },
        },
        renderExtras: () => {
            ctx.font = "32px serif";
            ctx.fillStyle = gateClosed ? "#E20" : "#2E0";
            ctx.fillText(tollGateInput[0], 225, 165);
            ctx.fillText(tollGateInput[1], 255, 165);
            ctx.fillText(tollGateInput[2], 285, 165);
        },
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
            // BIG RIGHT SIDE BUTTON
            x: 370,
            y: 135,
            width: 55,
            height: 45,
            cursor: "pointer",
            click: () => {
                audioFiles["button-large"].play();
                if (tollGateInput[0] == 5 &&
                    tollGateInput[1] == 7 &&
                    tollGateInput[2] == 2)
                {
                    gateClosed = !gateClosed;
                    audioFiles["motor-outside-gate"].play();
                    freezeInputs = true;
                    canvas.style.cursor = "wait";
                    drawFrame(false);
                    audioFiles["motor-outside-gate"].addEventListener("ended", () => {
                        freezeInputs = false;
                        drawFrame();
                    });
                }
            },
        },{
            // SMALL RIGHT SIDE BUTTON
            x: 323,
            y: 145,
            width: 25,
            height: 25,
            cursor: "pointer",
            click: () => {
                audioFiles["button-small"].play();
                if (gateClosed)
                {
                    tollGateInput[2] = (tollGateInput[2] + 1) % 10;
                    tollGateInput[1] = (tollGateInput[1] + 1) % 10;
                    drawFrame();
                }
            },
        },{
            // SMALL LEFT SIDE BUTTON
            x: 178,
            y: 145,
            width: 25,
            height: 25,
            cursor: "pointer",
            click: () => {
                audioFiles["button-small"].play();
                if (gateClosed)
                {
                    tollGateInput[0] = (tollGateInput[0] + 1) % 10;
                    tollGateInput[1] = (tollGateInput[1] + 1) % 10;
                    drawFrame();
                }
            },
        },],
    },



    // Inside the courtyard behind the gate
    "courtyard": {
        getImageURL: () => "./images/0056.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-left");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-right");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("factory-entrance");
            },
        },],
    },
    "courtyard-left": {
        getImageURL: () => "./images/0057.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 200,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard");
            },
        },],
    },
    "courtyard-reverse": {
        getImageURL: () => "./images/0058.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("gate-reverse");
            },
        },],
    },
    "courtyard-right": {
        getImageURL: () => "./images/0059.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-reverse");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles");
            },
        },],
    },





    // Inside the courtyard behind the gate
    "courtyard-flagpoles": {
        getImageURL: () => "./images/0061.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-left");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-right");
            },
        },{
            x: 130,
            y: 0,
            width: WIDTH - 260,
            height: 120,
            cursor: "n-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-up");
            },
        },],
    },
    "courtyard-flagpoles-left": {
        getImageURL: () => "./images/0062.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles");
            },
        },],
    },
    "courtyard-flagpoles-reverse": {
        getImageURL: () => "./images/0063.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("courtyard-left");
            },
        },],
    },
    "courtyard-flagpoles-right": {
        getImageURL: () => "./images/0064.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles-reverse");
            },
        },],
    },
    "courtyard-flagpoles-up": {
        getImageURL: () => "./images/0060.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: HEIGHT - 120,
            width: WIDTH,
            height: 120,
            cursor: "s-resize",
            click: () => {
                transitionToPage("courtyard-flagpoles");
            },
        },],
    },



    // Inside the courtyard behind the gate
    "courtyard-puzzleboard": {
        getImageURL: () => "./images/0065.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-left");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-right");
            },
        },],
    },
    "courtyard-puzzleboard-left": {
        getImageURL: () => "./images/0066.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-reverse");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard");
            },
        },],
    },
    "courtyard-puzzleboard-reverse": {
        getImageURL: () => "./images/0067.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-right");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-left");
            },
        },{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                transitionToPage("courtyard-right");
            },
        },],
    },
    "courtyard-puzzleboard-right": {
        getImageURL: () => "./images/0068.png",
        audio: {
            "outside-birds": {
                volume: 0.7,
                loop: true,
            },
        },
        clickAreas: [{
            x: 0,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "w-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard");
            },
        },{
            x: WIDTH - 150,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "e-resize",
            click: () => {
                transitionToPage("courtyard-puzzleboard-reverse");
            },
        }],
    },

    // Main Factory Entrance
    "factory-entrance": {
        getImageURL: () => "./images/0069.png",
        audio: {
        },
        clickAreas: [{
            x: (WIDTH - 150)/2,
            y: 0,
            width: 150,
            height: HEIGHT,
            cursor: "n-resize",
            click: () => {
                alert("Congrats! You made it to the end of the short work in progress. Feel free to explore elsewhere, there's not much to find.");
            },
        },{
            x: 0,
            y: HEIGHT - 80,
            width: WIDTH,
            height: 80,
            cursor: "alias",
            click: () => {
                transitionToPage("courtyard-reverse");
            },
        },],
    },
};



let currentPage = pages["start"];
// currentPage = pages["toll-inside-down"];

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

    // Render extra stuff for the scene if necessary
    if (currentPage?.renderExtras) {
        currentPage.renderExtras();
    }

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
            ctx.strokeRect(clickArea.x, clickArea.y, clickArea.width, clickArea.height);
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

    // Set the cursor to waiting
    canvas.style.cursor = "wait";
    freezeInputs = true;

    // First, render without click areas
    await drawFrame(false);

    // Set the new page
    currentPage = pages[pageID];

    // Set up audio for new page
    {
        // Play all audio in the area
        for (let audioID in currentPage.audio) {
            // Get the data for the audio
            const audioData = currentPage.audio[audioID];

            audioFiles[audioID].volume = audioData.volume;
            audioFiles[audioID].loop = audioData.loop;

            if (audioFiles[audioID].paused) {
                audioFiles[audioID].play();
            }
        }

        // Stop all looping audio that isn't here
        for (let audioID in audioFiles) {
            const audioElement = audioFiles[audioID];
            if (audioElement.loop &&
                !audioElement.paused &&
                !(audioID in currentPage.audio))
            {
                audioElement.pause();
            }
        }
    }

    // Run the animation
    await transitionAnimationToImage(currentPage.getImageURL());

    freezeInputs = false;

    // Finally, set up the game to get going again
    drawFrame();
    setCursorStyle();
}




const IMAGE_BIT_SIZE = 3;
const TRANSITION_TIME_MS = 200;

async function transitionAnimationToImage(imageURL) {
    let transitionTimeRemaining = TRANSITION_TIME_MS;
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
    }

    // Just to keep things clean
    transitionTimeRemaining = 0;
}















// Input handler

canvas.addEventListener("mousemove", (e) => {
    if (freezeInputs) return;
    updateMousePositionFromEvent(e);

    drawFrame();
    setCursorStyle();
});

canvas.addEventListener("mouseleave", (e) => {
    if (freezeInputs) return;
    mouseX = -100;
    mouseY = -100;
    drawFrame();
    setCursorStyle();
});

canvas.addEventListener("click", (e) => {
    if (freezeInputs) return;
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
    // console.log({mouseX, mouseY});
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
const foo = await imageLib.getOrAddImage("images/0000.png");

drawFrame();

if (audioFiles["outside-birds"].duration > 0) {
    audioFiles["outside-birds"].loop = true;
    // audioFiles["outside-birds"].play();
} else {
    audioFiles["outside-birds"].addEventListener("canplaythrough", (e) => {
        audioFiles["outside-birds"].loop = true;
        // audioFiles["outside-birds"].play();
    });
}
