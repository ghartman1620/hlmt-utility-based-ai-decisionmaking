import { should } from "chai";
import "mocha";
import ActionDecider from "../src/action-decider";
import { Action, CurveType } from "../src/action-decider";

should();

// A sample game state for the purpose of testing. It has
// merely a number of entities and a score.
interface IState {
    enemies: number;
    health: number;
}

function fight(state: IState) {
    state.enemies--;
}

function heal(state: IState) {
    state.health++;
}

// random ruminations that probably aren't needed but i wanted to keep them
// some place not in their own file
/*
i would like to be able to put an object in my actors
and give the object some actions, and for each action give it some axis

ActionDecider a = new ActionDecier();
a.addAction(run_away);
a.addAxis(run_away, function_that_returns_input(), min_input_val,
 max_input_val, curve, inverted);

then come along later and ask:
myAction = a.decideAction();
myAction();

Do, according to the api, actions have duration?
Can an action complete? If so, it's sort of tied in
with the game loop, which I don't want the system to interface with. Alternately, perhaps

// todo in the api
// how to add method of scoring actions per target
// add slope, x intercept, y intercept inputs to all response curves
// Compensation factor for # of axis - learn more detail about this
    // we want 6 axis with .9 score to be better than
    // 2 axis with .8 score
    //  see https://www.gdcvault.com/play/1021848/Building-a-Better-Centaur-AI
    // at 10:10
*/

describe("ActionDecider", () => {
    let ad: ActionDecider;
    it("Should construct without error", () => {
        ad = new ActionDecider();
    });
    it("Should accept actions that mutate the game state and " +
        "recall those actions", () => {
        ad.addAction(fight);
        ad.addAction(heal);
        ad.getActions().should.contain(fight);
        ad.getActions().should.contain(heal);
    });
    it("Should allow a single axis to be added " +
        "for any given action", () => {
        // add an axis to fighting counting
        // number of enemies, with min 0 and max 10
        // It can be linear, and it should not be inverted
        // (that is, more enemies = higher utility of fighting)
        ad.addAxisForAction(fight, (state: IState) => state.enemies,
                            0, 10, CurveType.Linear, false);

        // add an axis to healing counting
        // health, 0-100. quadratic because as our health is very low
        // the utility of healing is high,
        // and inverted because low health = high utility of healing
        ad.addAxisForAction(heal, (state: IState) => state.health,
                            0, 100, CurveType.Quadratic, true);
    });

    // These tests should be improved with exact values.
    it("Should have a high probability of picking healing " +
        "when health is low and few enemies", () => {
        const state: IState = {
            enemies: 1,
            health: 1,
        };
        const prob: Map<Action, number> = ad.getProbabilities(state);
        // should be more likely to pick healing than fighting
        // in this particular circumstance
        prob.get(fight).should.be.below(prob.get(heal));
        // in fact, it should be ALOT less.
        prob.get(fight).should.be.below(prob.get(heal) / 2);
        // And we should always pick something.
        (prob.get(heal) + prob.get(fight)).should.be.approximately(1, .01);
        ad.decideAction(state, .5).should.equal(heal);
    });
    it("Should have a high probability of picking fighting " +
        "when there are many enemies and health is high", () => {
        const state: IState = {
            enemies: 9,
            health: 90,
        };
        const prob: Map<Action, number> = ad.getProbabilities(state);
        // should be more likely to pick fighting than healing
        // in this particular circumstance
        prob.get(heal).should.be.below(prob.get(fight));
        // in fact, it should be ALOT less.
        prob.get(heal).should.be.below(prob.get(fight) / 2);
        (prob.get(heal) + prob.get(fight)).should.be.approximately(1, .01);
        ad.decideAction(state, .5).should.equal(fight);
    });
    it("Should allow a user to call a selected function and " +
        "make a resulting state change", () => {
        let state: IState = {
            enemies: 9,
            health: 90,
        };
        // Perform fight action
        // ad.decideAction(state, .5) should return the function
        // fight, and (state) should call the fight function
        // on state and modify it.
        ad.decideAction(state, .5)(state);
        state.enemies.should.equal(8);
        state = {
            enemies: 1,
            health: 1,
        };
        // Perform heal action
        ad.decideAction(state, .5)(state);
        state.health.should.equal(2);
    });
});
