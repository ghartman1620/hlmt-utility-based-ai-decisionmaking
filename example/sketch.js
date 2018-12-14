function setup(){
    createCanvas(500, 500);
}

const Team = {
    Red: 0,
    Blue: 1,
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

class Dude{
    constructor(id, xcoord, ycoord, team, health = 100, attackDamage = 5, speed = 2, range= 1) {
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
        const healAction = function(state) {
            state.allDudes[me.id].beginHealing();
        };
        this.actionDecider.addAction(healAction);
        
        // Heal if we're low on hp
        this.actionDecider.addAxisForAction(healAction, function(state) {
            return state.allDudes[me.id].health;  
        }, new QuadraticResponseCurve(0, 100, 1, 1));
        // Heal if our enemies have much more hp than us
        const maxHealthDiff = 50;
        const minHealthDiff = -50;
        this.actionDecider.addAxisForAction(healAction, function(state){
            // get avg health of nearby enemies
            const nearbyHealthSum = 0;
            const nearbyEnemies = 0;
            const enemyTeam = me.team == Team.Red ? state.blueTeam : state.redTeam;
            for(const enemy of enemyTeam) {
                // enemy is nearby
                if(distance(me.xCoordinate, me.yCoordinate, enemy.xCoordinate, enemy.yCoordinate) < 100) {
                    nearbyHealthSum += enemy.health;
                    nearbyEnemies++;
                }
            }
            // no enemies => return min, the value that has a utility of 1 for this curve
            if (nearbyEnemies === 0) {
                return minHealthDiff;
            }
            nearbyHealthSum /= nearbyEnemies;
            return me.health - nearbyHealthSum;
        }, new LogisticResponseCurve(10));
        
        this.actionDecider.addAxisForAction(healAction, function(state) {
            const castle = me.team == Team.Red ? state.redCastle : state.blueCastle;
            return distance(me.xCoordinate, me.yCoordinate, castle.xCoordinate, castle.yCoordinate);
        }, new LinearResponseCurve(0, 1000, -.4, 1));
        
        
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
            return state.allDudes[me.id].health;
        }, new LogisticResponseCurve(0, 100, -10));
        
        this.actionDecider.addTargetedAxisForAction(attackAction, function(state, target){
            return state.allDudes[target.id].health;
        }, new LinearResponseCurve(0, 100, -.25, 1));
        
        this.actionDecider.addTargetedAxisForAction(attackAction, function(state, target){
            const theirCastle = target.team == Team.Red ? state.redCastle : state.blueCastle;
            return distance(target.xCoordinate, target.yCoordinate, theirCastle.xCoordinate, theirCastle.yCoordinate);
        }, new QuadraticResponseCurve(0, 500, .75, .25));
        
        
        
        // We run away
        const runAction = function(state) {
            state.allDudes[me.id].beginRetreating();
        };
        this.actionDecider.addAction(runAction);
        this.actionDecider.addAxisForAction(runAction, function(state) {
            return state.allDudes[me.id].health;
        }, new QuadraticResponseCurve(0, 100, 1, 1));
        
        this.actionDecider.addAxisForAction(runAction, function(state){
            const us = me.team == Team.Red ? state.redTeam : state.blueTeam;
            const them = me.team == Team.Red ? state.blueTeam : state.redTeam;
            return them.length - us.length;
            
        }, new LogisticResponseCurve(-5, 5, -20));
    
        
        // We go to friends
        const goToFriendAction = function(state) {
            state.allDudes[me.id].beginGoingToFriends();
        };
        this.actionDecider.addAction(goToFriendAction);
        this.actionDecider.addAxisForAction(goToFriendAction, function(state) {
            const myTeam = me.team == Team.Red ? state.redTeam : state.blueTeam;
            let nearbyFriends = 0;
            for(const friend of myTeam) {
                // enemy is nearby
                if(distance(me.xCoordinate, me.yCoordinate, friend.xCoordinate, friend.yCoordinate) < 500) {
                    nearbyFriends++;
                }
            }
            return nearbyFriends;
        }, new LogisticResponseCurve(0, 5, 15));
        
    }

    beginHealing() {
        this.currentAction = this.heal;
        this.actionArg = undefined;
    }
    beginAttacking(opponentDude) {
        this.currentAction = this.attack;
        this.actionArg = opponentDude;
    }
    beginRetreating() {
        this.currentAction = this.retreat;
        this.actionArg = undefined;
    }
    beginGoingToFriends() {
        this.currentAction = this.goToFriend;
        this.actionArg = undefined;
    }
    
    

    heal(){
        console.log("dude " + this.id + " is healing");
        this.health += 10;
            //CHANGE TO CONDITIONAL MOVE LATER
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
        console.log("dude " + this.id + " is attacking " + opponentDude.id);
        opponentDude.health -= this.attackDamage;
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

    retreat(){
        console.log("dude " + this.id + " is retreating");
        
        let dir = this.team == Team.Red ? -1 : 1;
        this.yCoordinate += dir * this.speed;
    }
    
    goToFriend() {
        console.log("dude " + this.id + " is going to friend");
        // implement me!
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
    update() {
        try{
            
            this.currentAction(this.actionArg);   
        }
        catch(e){
            console.log(this.currentAction);
            throw e;
        }
    }
    think(gameState) {
        console.log("dude " + this.id + " is thinking");
        this.actionDecider.decideAction(gameState)(gameState);
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
const redTeam = []
const blueTeam = []
const allDudes = [];
let dudeId = -1;
let redCastle = new Castle(60, Math.random() * 60 + 80, Team.Red);
let blueCastle = new Castle(60, Math.random() * 60 + 420, Team.Blue);
while(challengerCount != 0){

    let redblueXCoord = Math.random() * 350 + 100;
    let redYCoord = Math.random() * 60 + 80;
    let blueYCoord = Math.random() * 60 + 420;

    let redDude = new Dude(++dudeId, redblueXCoord, redYCoord, Team.Red);
    redTeam.push(redDude);

    let blueDude = new Dude(++dudeId, redblueXCoord, blueYCoord, Team.Blue);
    blueTeam.push(blueDude);
    allDudes.push(redDude);
    allDudes.push(blueDude);
    challengerCount--;
}


const gameState = {
    redTeam,
    blueTeam,
    redCastle,
    blueCastle,
    allDudes
}

function drawState(state){
    for(var dude of state.redTeam){
        dude.update();
        dude.draw();
    }
    for(var dude of state.blueTeam){
        dude.update();
        dude.draw();
    }
    state.redCastle.draw();
    state.blueCastle.draw();
}


let ups = 1;
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

        for(const dude of gameState.allDudes){
            dude.think(gameState);
        }

    }
    frame++;
}
