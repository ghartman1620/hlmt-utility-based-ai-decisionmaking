function setup(){
    createCanvas(500, 500);
}

class Dude{
    constructor(xcoord, ycoord, team, health = 100, attackDamage = 5, speed = 2, range= 1){
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.health = health;
        this.attackDamage = attackDamage;
        this.speed = speed;
        this.range = range;
        this.team = team
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

    // retreat(team){
    //     if(team == "red"){
    //         directionToCastle = redCastle.xCoordinate - this.xCoordinate;
    //         if(directionToCastle < 0){
    //             this.xCoordinate = this.xCoordinate + this.speed;
    //         }
    //         else{
    //             this.xCoordinate = this.xCoordinate - this.speed;
    //         }
    //     }
    // }
    draw(){
        if(this.team == "red"){
            fill(255, 0, 0);
        }
        if(this.team == "blue"){
            fill(0, 0, 255);
        }
        ellipse(this.xCoordinate, this.yCoordinate, 50, 50);
    }
}

challengerCount = Math.round(Math.random()*5);
redTeam = []
blueTeam = []
var dude1 = new Dude(100, 200, "red")
var dude2 = new Dude(100, 400, "blue")
var dude3 = new Dude(200, 200, "red")
var dude4 = new Dude(200, 400, "blue")
var dude5 = new Dude(300, 200, "red")
var dude6 = new Dude(300, 400, "blue")
redTeam.push(dude1, dude3, dude5);
redTeam.push(dude2, dude4, dude6);
// while(challengerCount != 0){

// }

let gameState = {
    redTeam,
    blueTeam
}
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
        for(const guy of gameState.redTeam){
            guy.xCoordinate += (Math.random() - .5);
            guy.yCoordinate += (Math.random() - .7); 
        }
        for(const guy of gameState.blueTeam){
            guy.xCoordinate += (Math.random() - .5);
            guy.yCoordinate += (Math.random() - .7); 
        }
    }
    frame++;
}