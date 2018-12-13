function setup(){
    createCanvas(500, 500);
}

const Team = {
    Red: 0,
    Blue: 1,
}

class Dude{
    constructor(xcoord, ycoord, team, health = 100, attackDamage = 5, speed = 2, range= 1){
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.health = health;
        this.attackDamage = attackDamage;
        this.speed = speed;
        this.range = range;
        if (!(team === Team.Red || team === Team.Blue)) {
            throw new Error("Team should be either Team.Blue or Team.Red");
        }
        this.team = team;
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
        if(directionX < -10 | directionX > 10){
            if(directionX < 0){
                this.xCoordinate = this.xCoordinate - this.speed;
            }
            else if(directionX > 0){
                this.xCoordinate = this.xCoordinate + this.speed;
            }
        }
        if(directionY < -10 | directionY > 10){
            if(directionY < 0){
                this.yCoordinate = this.yCoordinate - this.speed;
            }
            else if(directionX > 0){
                this.yCoordinate = this.yCoordinate + this.speed;
            }
        }
    }

    retreat(team){
        if(team == Team.Red){
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
        if(this.team == Team.Red){
            fill(255, 0, 0);
        }
        if(this.team == Team.Blue){
            fill(0, 0, 255);
        }
        ellipse(this.xCoordinate, this.yCoordinate, 50, 50);
    }
}

class Castle{
    constructor(xcoord = 60, ycoord, team){
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.team = team;
    }

    draw(){
        if(this.team == Team.Red){
            fill(255, 0, 0);
        }
        if(this.team == Team.Blue){
            fill(0, 0, 255);
        }
        rect(this.xCoordinate, this.yCoordinate,40,40);
    }
}

challengerCount = Math.round(Math.random()*3 + 2);
redTeam = []
blueTeam = []
let redCastle = new Castle(60, Math.random() * 60 + 80, Team.Red);
let blueCastle = new Castle(60, Math.random() * 60 + 420, Team.Blue);
while(challengerCount != 0){

    let redblueXCoord = Math.random() * 350 + 100;
    let redYCoord = Math.random() * 60 + 80;
    let blueYCoord = Math.random() * 60 + 420;

    let redDude = new Dude(redblueXCoord, redYCoord, Team.Red);
    redTeam.push(redDude);

    let blueDude = new Dude(redblueXCoord, blueYCoord, Team.Blue);
    blueTeam.push(blueDude);

    challengerCount--;
}


let gameState = {
    redTeam,
    blueTeam,
    redCastle,
    blueCastle
}

function drawState(state){
    for(var dude of state.redTeam){
        dude.draw();
    }
    for(var dude of state.blueTeam){
        dude.draw();
    }
    state.redCastle.draw();
    state.blueCastle.draw();
}
let ups = 20;
var interval = Math.floor(60/ups);  
var frame = 0;
var ad = new ActionDecider();

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

    }
    frame++;
}
