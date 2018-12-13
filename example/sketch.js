function setup(){
    createCanvas(500, 500);
}

const Team = {
    Red: 0,
    Blue: 1,
}

class Dude{
    constructor(xcoord, ycoord, team, health = 100, attackDamage = 5, speed = 4, range= 1){
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


    heal(Castle){
        if (this.team = Team.red)
        //Castle = gameState.get(redCastle);
        else
        //Castle = gameState.get(blueCastle);

        if ((Castle.xCoordinate - 40 <= this.xCoordinate <= Castle.xCoordinate + 40) &&
           (Castle.yCoordinate - 40 <= this.yCoordinate <= Castle.yCoordinate + 40))
        this.health += 10;
        else
            this.move(Castle.xCoordinate,Castle.yCoordinate);
    }

    distance(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
    }

    goToFriend(team) {
        let minDistance = 0;
        let friendXCoordinate = 0;
        let friendYCoordinate = 0;
        for (friend of team) {
            let currentDistance = this.distance(this.xCoordinate,this.yCoordinate
                        ,friend.xCoordinate,friend.yCoordinate);
            if (currentDistance < minDistance)
                {
                  minDistance = currentDistance;
                  friendXCoordinate = friend.xCoordinate;
                  friendYCoordinate = friend.yCoordinate
                }
        }
        this.move(friendXCoordinate,friendYCoordinate);
    }

    attack(opponentDude){
        //If you are within range to attack
        if (this.distance(this.xCoordinate,this.yCoordinate,
                           opponentDude.xCoordinate,opponentDude.yCoordinate) <= this.range)
                opponentDude.health -= this.attackDamage;
        else 
            this.move(opponentDude.xCoordinate,opponentDude.yCoordinate);
    }

    move(xcoord, ycoord){
        let distance = this.distance(this.xCoordinate,this.yCoordinate,xcoord,ycoord);
        let deltaY = Math.abs(this.yCoordinate - ycoord);
        let deltaX = Math.abs(this.xCoordinate - xcoord);

        let iy = this.speed * (deltaY/distance);
        let ix = this.speed * (deltaX/distance);

        
            //Distance can be adjusted to stop closer/farther from target
            if(distance > 70) {
                if ((xcoord < this.xCoordinate) && (ycoord < this.yCoordinate)) {
                    this.xCoordinate -= ix;
                    this.yCoordinate -= iy;
                }
                if ((xcoord > this.xCoordinate) && (ycoord > this.yCoordinate)) {
                    this.xCoordinate += ix;
                    this.yCoordinate += iy;
                }
                if ((xcoord > this.xCoordinate) && (ycoord < this.yCoordinate)) {
                    this.xCoordinate += ix;
                    this.yCoordinate -= iy;
                }
                if ((xcoord < this.xCoordinate) && (ycoord > this.yCoordinate)) {
                    this.xCoordinate -= ix;
                    this.yCoordinate += iy;
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
let redCastle = new Castle(Math.random()*400, Math.random() * 60 + 80, Team.Red);
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

        gameState.blueTeam[0].move(redCastle.xCoordinate, redCastle.yCoordinate);
        console.log("X coor is: " + blueTeam[0].xCoordinate);
        console.log("Y coor is: " + blueTeam[0].yCoordinate);

    }
    frame++;
}
