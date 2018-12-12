function setup(){
    createCanvas(500, 500);
}

class Dude{
    constructor(xcoord, ycoord, health = 100, attackDamage = 5, speed = 2, range= 1){
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.health = health;
        this.attackDamage = attackDamage;
        this.speed = speed;
        this.range = range;
    }

    heal(){
        this.health += 10;
    }

    attack(opponentDude){
        opponentDude.health -= this.attackDamage;
    }

    move(xcoord, ycoord){
        directionX = xcoord - this.xCoordinate;
        directionY = ycoord - this.yCoordinate;
        if(directionX < 0){
            this.xCoordinate = this.xCoordinate + this.speed;
        }
        else{
            this.xCoordinate = this.xCoordinate - this.speed;
        }
        if(directionY < 0){
            this.yCoordinate = this.yCoordinate + this.speed;
        }
        else{
            this.yCoordinate = this.yCoordinate - this.speed;
        }
    }
    draw(){
        fill(87)
        ellipse(this.xCoordinate, this.yCoordinate, 50, 50)
    }
}

// challengerCount = Math.round(Math.random()*5)
// while(challengerCount != 0){

// }

let gameState = [
    new Dude(100, 200),
    new Dude(400, 200)
    
]
function drawState(state){
    for(var dude of state){
        dude.draw()
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
        for(const guy of gameState){
            guy.xCoordinate += (Math.random() - .5);
            guy.yCoordinate += (Math.random() - .7); 
        }
    }
    frame++;
}