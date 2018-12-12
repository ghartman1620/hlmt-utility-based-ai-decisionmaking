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
        let directionX = xcoord - this.xCoordinate;
        let directionY = ycoord - this.yCoordinate;
        if(directionX < 0){
            this.xCoordinate = this.xCoordinate - this.speed;
        }
        else if(directionX > 0){
            this.xCoordinate = this.xCoordinate + this.speed;
        }
        if(directionY < 0){
            this.yCoordinate = this.yCoordinate - this.speed;
        }
        else if(directionX > 0){
            this.yCoordinate = this.yCoordinate + this.speed;
        }
    }

    retreat(team){
        if(team == "red"){
            directionToCastle = redCastle.xCoordinate - this.xCoordinate;
            if(directionToCastle < 0){
                this.xCoordinate = this.xCoordinate + this.speed;
            }
            else{
                this.xCoordinate = this.xCoordinate - this.speed;
            }
        }
    }
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

challengerCount = Math.round(Math.random()*2 + 1);
redTeam = []
blueTeam = []
while(challengerCount != 0){

    let redblueXCoord = Math.random() * 350 + 100;
    let redYCoord = Math.random() * 60 + 80;
    let blueYCoord = Math.random() * 60 + 420;

    let redDude = new Dude(redblueXCoord, redYCoord, "red");
    redTeam.push(redDude);

    let blueDude = new Dude(redblueXCoord, blueYCoord, "blue");
    blueTeam.push(blueDude);

    challengerCount--;
}

let gameState = {
    redTeam,
    blueTeam
}
function drawState(state){
    for(var dude of state.redTeam){
        dude.draw()
    }
    for(var dude of state.blueTeam){
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
        // for(const guy of gameState.redTeam){
        //     guy.xCoordinate += (Math.random() - .5);
        //     guy.yCoordinate += (Math.random() - .7); 
        // }
        // for(const guy of gameState.blueTeam){
        //     guy.xCoordinate += (Math.random() - .5);
        //     guy.yCoordinate += (Math.random() - .7); 
        // }

        //test for heal
        if(gameState.blueTeam[0].health == 100){
            gameState.blueTeam[0].heal();
        }

        gameState.blueTeam[0].move(250, 250);

        console.log(gameState.blueTeam[0]);
    }
    frame++;
}