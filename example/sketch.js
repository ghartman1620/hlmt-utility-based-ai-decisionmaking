function setup(){
    createCanvas(500, 500);
}
let gameState = {
    badGuys: [
        {
            x: 100,
            y: 100
        },
        {
            x: 200, 
            y: 100
        },
        {
            x: 300,
            y: 100
        }
    ],
    goodGuys: [
        {
            x: 100,
            y: 300
        },
        {
            x: 200,
            y: 300
        },
        {
            x: 300,
            y: 300
        }
    ]
}
function drawState(state){
    stroke(255, 0, 0);
    for(const guy of state.goodGuys){
        ellipse(guy.x, guy.y, 25, 25);
        line(guy.x + 12.5, guy.y, guy.x+12.5, guy.y-15);
        line(guy.x - 7, guy.y - 4, guy.x-2, guy.y-2);
        line(guy.x + 7, guy.y - 4, guy.x+2, guy.y-2);
    }
    stroke(0, 0, 255);
    for(const guy of state.badGuys){
        ellipse(guy.x, guy.y, 25, 25);
        line(guy.x + 12.5, guy.y, guy.x+12.5, guy.y+15);
        line(guy.x - 7, guy.y - 4, guy.x-2, guy.y-2);
        line(guy.x + 7, guy.y - 4, guy.x+2, guy.y-2);
    }
}
let ups = 20;
var interval = Math.floor(60/ups);  
var frame = 0;

function draw(){
    background(255);
    drawState(gameState);
    if (frame === interval){
        frame = 0;
        for(const guy of gameState.goodGuys){
        guy.x += (Math.random() - .5)
        guy.y += (Math.random() - .7)
        
        }
        for(const guy of gameState.badGuys){
            guy.x += (Math.random() - .5)
            guy.y += (Math.random() - .3)
        }
    }
    frame++;
}