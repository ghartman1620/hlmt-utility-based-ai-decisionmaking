const width = 1000;
const length = 1000;
function setup(){
    createCanvas(width, length);
}

const Team = {
    Red: 0,
    Blue: 1,
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

class Dude{
    constructor(id, xcoord, ycoord, team, health = 100, attackDamage = .5, speed = 2, range= 50) {
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.health = health;
        this.attackDamage = attackDamage;
        this.speed = speed;
        this.range = range;
        this.currentAction = () => {};
        this.id = id;
        if (!(team === Team.Red || team === Team.Blue)) {
            throw new Error("Team should be either Team.Blue or Team.Red");
        }
        this.team = team;
        this.actionDecider = new ActionDecider();
        
        
        const me = this;
        
        // We heal when our health is low, we're near the castle, and/or our enemies have more hp than it
        const healAction = function(state, target) {
            state.allDudes[me.id].beginHealing(target);
        };
        this.actionDecider.addTargetedAction(healAction, function(state) {
            return me.team == Team.Red ? state.redCastles : state.blueCastles;
        });
        
        // Heal if we're low on hp
        this.actionDecider.addAxisForAction(healAction, function(state) {
            return state.allDudes[me.id].health;  
        }, new QuadraticResponseCurve(0, 100, 1, 1));
        // Go to nearby castles
        this.actionDecider.addTargetedAxisForAction(healAction, function(state, castle){
            return distance(me.xCoordinate, me.yCoordinate, castle.xCoordinate, castle.yCoordinate);
        }, new QuadraticResponseCurve(100, 500, 1, 1, .75));
        // Go to castles without many dudes
        this.actionDecider.addTargetedAxisForAction(healAction, function(state, castle){
            return castle.dudeCount;
        }, new LinearResponseCurve(0, 10, -1, 1));
        
        // We attack enemies
        const attackAction = function(state, target) {
            state.allDudes[me.id].beginAttacking(target);
        }
        this.actionDecider.addTargetedAction(attackAction, function(state) {
            if(me.team === Team.Red){
                return state.blueTeam;
            } else {
                return state.redTeam;
            }
        });
        
        this.actionDecider.addAxisForAction(attackAction, function(state){
            return me.health;
        }, new LogisticResponseCurve(0, 100, -10));
        
        this.actionDecider.addTargetedAxisForAction(attackAction, function(state, target){
            return target.health;
        }, new LinearResponseCurve(0, 100, -.25, 1));
        this.actionDecider.addTargetedAxisForAction(attackAction, function(state, target){
            return target.currenAction === target.retreat ? .5 : 1
        }, new LinearResponseCurve(0, 1));
        // this axis (that didn't pan out) was distance to target.
        // instead, we replace it by not tending to attack dudes that are running
//        this.actionDecider.addTargetedAxisForAction(attackAction, function(state, target) {
//            return distance(me.xCoordinate, me.yCoordinate, target.xCoordinate, target.yCoordinate);
//        }, new QuadraticResponseCurve(0, 600, .75, 1, .15));
        
        
        
        // We run away
        const runAction = function(state) {
            state.allDudes[me.id].beginRetreating();
        };
        this.actionDecider.addAction(runAction);
        this.actionDecider.addAxisForAction(runAction, function(state) {
            return state.allDudes[me.id].health;
        }, new QuadraticResponseCurve(0, 25, 1, 1));
        
        this.actionDecider.addAxisForAction(runAction, function(state){
            const us = me.team == Team.Red ? state.redTeam : state.blueTeam;
            const them = me.team == Team.Red ? state.blueTeam : state.redTeam;
            return them.length - us.length;
            
        }, new LogisticResponseCurve(-5, 5, -20));
        
    }

    beginHealing(castle) {
        // remove ourselves from castle if we were in a castle
        if(this.currentAction == this.heal){
            this.actionArg.dudeCount--;
        }
        this.currentAction = this.heal;
        castle.dudeCount ++;
        this.actionArg = castle;
    }
    beginAttacking(opponentDude) {
        // remove ourselves from castle if we were in a castle
        if(this.currentAction == this.heal){
            this.actionArg.dudeCount--;
        }
        this.currentAction = this.attack;
        this.actionArg = opponentDude;
    }
    beginRetreating() {
        // remove ourselves from castle if we were in a castle
        if(this.currentAction == this.heal){
            this.actionArg.dudeCount--;
        }
        this.currentAction = this.retreat;
        this.actionArg = undefined;
    }
    
    

    heal(castle){
        // console.log("dude with health " + this.health +" healing");
        if (castle.contains(this)) {
            console.log("I am healing and my hp is " + this.health);
            this.health += 10/castle.dudeCount;
        }
        else
            this.move(castle.xCoordinate, castle.yCoordinate);
    }

    attack(opponentDude){
        //If you are within range to attack
        if (distance(this.xCoordinate,this.yCoordinate,
                           opponentDude.xCoordinate,opponentDude.yCoordinate) <= this.range)
                opponentDude.health -= this.attackDamage;
        else 
            this.move(opponentDude.xCoordinate,opponentDude.yCoordinate);
    }

    move(xcoord, ycoord){
        let dist = distance(this.xCoordinate,this.yCoordinate,xcoord,ycoord);
        let deltaY = Math.abs(this.yCoordinate - ycoord);
        let deltaX = Math.abs(this.xCoordinate - xcoord);
        if(isNaN(dist)) {
            console.log(xcoord);
            console.log(ycoord);
            throw new Error("nan dist");
        }
        let iy = this.speed * (deltaY/dist);
        let ix = this.speed * (deltaX/dist);

        
            //Distance can be adjusted to stop closer/farther from target
            if(dist > 10) {
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

    retreat(){
        // console.log("dude with health " + this.health + "retreating")
        let dir = this.team == Team.Red ? -1 : 1;
        this.yCoordinate += dir * this.speed;
    }
    
    draw(){
        let green  = 0;
        if(this.currentAction === this.retreat) {
            green = 100;
        }
        if(this.currentAction === this.heal) {
            green = 255;
        }
        if(this.team == Team.Red){
            fill(155 + this.health, green, 0);
        }
        if(this.team == Team.Blue){
            fill(0, green, 155 + this.health);
        }
        ellipse(this.xCoordinate, this.yCoordinate, 20, 20);
    }
    update() {
        this.currentAction(this.actionArg); 
        
    }
    think(gameState) {
        // don't reconsider what we're doing if we are retreating 
        // or if we're going to heal and dont have very much hp
        if(this.currentAction === this.retreat) return;
        if(this.currentAction === this.heal && this.health < 75) return;
        if(this.currentAction === this.heal){
            console.log("i am thinking again and my health is " + this.health);
        }
        this.actionDecider.decideAction(gameState)(gameState);
        
              
    }
}

class Castle{
    constructor(xcoord = 60, ycoord, team){
        this.xCoordinate = xcoord;
        this.yCoordinate = ycoord;
        this.team = team;
        this.dudeCount = 0;
    }
    // true if dude within this castle, false otherwise
    contains(dude) {
        return (this.yCoordinate - 20 <= dude.xCoordinate) &&
             (dude.xCoordinate <= this.xCoordinate + 20) &&
             (this.yCoordinate - 20 <= dude.yCoordinate) &&
             (dude.yCoordinate <= this.yCoordinate + 20)
    }
    // number of dudes healing here
    containedDudes() {
        const dudes = this.team === Team.Red ? gameState.redTeam : gameState.blueTeam;
        let numDudes = 0;
        for(const dude of dudes) {
            if(this.contains(dude)){
                numDudes++;
            }
        }
        return numDudes;
    }
    
    draw(){
        if(this.team == Team.Red){
            fill(255, 0, 0);
        }
        if(this.team == Team.Blue){
            fill(0, 0, 255);
        }
        rect(this.xCoordinate-20, this.yCoordinate-20,40,40);
    }
}

const redTeam = [];
const blueTeam = [];
const allDudes = [];
let dudeId = -1;
const redCastles = [];
const blueCastles = [];
for(let i = 0; i < 7; i++){
    redCastles.push(new Castle(100 + Math.random() * 800, Math.random() * 60 + 80, Team.Red));
    blueCastles.push(new Castle(100 + Math.random() * 800, Math.random() * 60 + 920, Team.Blue));   
}
for(let i = 0; i < 100; i++){

    let redblueXCoord = Math.random() * 800 + 100;
    let redYCoord = Math.random() * 60 + 80;
    let blueYCoord = Math.random() * 60 + 920;

    let redDude = new Dude(++dudeId, redblueXCoord, redYCoord, Team.Red);
    redTeam.push(redDude);

    let blueDude = new Dude(++dudeId, redblueXCoord, blueYCoord, Team.Blue);
    blueTeam.push(blueDude);
    allDudes.push(redDude);
    allDudes.push(blueDude);
}


const gameState = {
    redTeam,
    blueTeam,
    redCastles,
    blueCastles,
    allDudes
}

function drawState(state){
    
    for(var castle of state.redCastles.concat(state.blueCastles)){
        castle.draw();
        castle.draw();
    }
    for(var dude of state.redTeam.concat(state.blueTeam)){
        dude.update();
        dude.draw();
    }
}

var framesPerThink = 10;

function draw(){
    background(255);
    for(const dude of gameState.allDudes){
        if (isNaN(dude.xCoordinate) || isNaN(dude.yCoordinate)){
            console.log(dude);
            throw new Error("this dude has nan coordinate");
        }
    }
    if (gameState.redTeam.length === 0){
        text("blue team wins", 100, 100);
    } else if(gameState.blueTeam.length === 0){
        text("red team wins", 100, 100);
    } else {
        for (const dude of gameState.redTeam.concat(gameState.blueTeam)) {
            if ((dude.health <= 0) || (dude.xCoordinate > width)  
            || (dude.yCoordinate > length) || (dude.xCoordinate < 0) 
            || (dude.yCoordinate < 0)) {

                if (dude.team == Team.Red) {
                    gameState.redTeam.splice(gameState.redTeam.indexOf(dude),1);
                }
                else
                    gameState.blueTeam.splice(gameState.blueTeam.indexOf(dude),1);
            }
        } 
        drawState(gameState);
//        if (frame === interval){
//            frame = 0;
//            // for(const guy of gameState.redTeam){
//            //     guy.xCoordinate += (Math.random() - .5);
//            //     guy.yCoordinate += (Math.random() - .7); 
//            // }
//            // for(const guy of gameState.blueTeam){
//            //     guy.xCoordinate += (Math.random() - .5);
//            //     guy.yCoordinate += (Math.random() - .7); 
//            // }
//
//            for(const dude of gameState.allDudes){
//                dude.think(gameState);
//            }
//
//        }
        const aliveDudes = gameState.redTeam.concat(gameState.blueTeam);
        for(let i = 0; i < aliveDudes.length/framesPerThink; i++){
            const dude = aliveDudes[Math.floor(Math.random()*aliveDudes.length)];
            dude.think(gameState);
        }
    }
    
}
