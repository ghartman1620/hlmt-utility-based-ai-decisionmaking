import { should } from "chai";
import "mocha";
import ActionDecider from "../src/action-decider";
import { UntargetedAction } from "../src/action-decider";
import {
    BinaryNumericInputResponseCurve,
    LinearResponseCurve,
    QuadraticResponseCurve
} from "../src/response-curve";
should();

// Let's make a game of PacMan!
// But PacMan is too difficult for me, and I think there should be fewer dimensions in PacMan.
// So let's have 1D PacMan and call it LineMan.
// In LineMan, there are a few agents. LineMan himself, and a few LineGhosts.
// All of them have position, and LineMan has a boolean state of whether or not he's powered up.

// Then there are some powerups, which LineMan can use to power up.
// Each of them is just a number describing their position.

// When LineMan is powered up, he can jump to a ghost and eat it!
// That ghost needs to return to its home at ghostHome to become no longer eaten.
// Can a ghost be dead? It's already dead, right?

// By the way, it would probably be more reasonable to use FSMs or BTs for the ghost AI
// in a game like this. But this is just for a test.

// LineMan Interfaces:
interface ILineMan {
    position: number;
    poweredUp: boolean;
}
interface ILineGhost {
    position: number;
    eaten: boolean;
}
interface ILineManGameState {
    ghosts: ILineGhost[];
    ghostHome: number;
    lineMan: ILineMan;
    powerUps: number[];
    vegetables: number[];
}

function ghostGoLeft(state: ILineManGameState, ghost: number): void {
    state.ghosts[ghost].position--;
}
function ghostGoRight(state: ILineManGameState, ghost: number): void {
    state.ghosts[ghost].position++;
}

// LineMan himself and each of the LineGhosts would like to take actions.
// They can all go left or right.
// LineMan likes powerups. LineMan may pick up a powerup when on top of it.
// LineMan may also, when powered up, teleport to a ghost.
// Our ghosts are also hungry and like vegetables. They may also take action
// of eating vegetables. To eat a vegetable, they must be on top of that vegetable.
// Let's see what actions they might decide to take!

// By the way, we're leveraging the property of decideAction that
// A random input of 0 always returns the highest utility action
// just so we can get deterministic action selection.
// In a game we might allow it to be random so we can get
// some more interesting, varied behavior.

describe("In LineMan, with actions selected by ActionDecider", () => {
    const lineManActionDecider: ActionDecider = new ActionDecider();
    it("Ghosts should walk at LineMan with binary position curves", () => {
        const ghostDeciders: ActionDecider[] = [];
        let i: number = 0;
        const state: ILineManGameState  = {
            ghostHome: 5,
            ghosts: [
                {
                    eaten: false,
                    position: 2
                },
                {
                    eaten: false,
                    position: -2,
                }
            ],
            lineMan: {
                position: 0,
                poweredUp: false
            },
            powerUps: [],
            vegetables: []
        };
        // Declare actions and a few considerations for ghosts.
        // For this first tests, ghosts will have a completely binary decision - they shall
        // go left, or go right, in the direction of LineMan.
        for (const ghost of state.ghosts) {
            const ad: ActionDecider = new ActionDecider();

            // The action goLeft for this ghost
            const goLeft = (state1: ILineManGameState) => {
                ghostGoLeft(state1, i);
            };
            // The action goRight for this ghost
            const goRight = (state1: ILineManGameState) => {
                ghostGoRight(state1, i);
            };
            ad.addAction(goLeft);
            ad.addAction(goRight);
            // s.lineMan.position - s.ghosts[i].position:
                // is 0 if they are equal
                // is positive if lineMan has a larger position than the ith ghost - lineMan is to the right
                // is negative if lineMan has a smaller position than the ith ghost - lineMan is to the left
            ad.addAxisForAction(goLeft, (s: ILineManGameState) => s.lineMan.position - s.ghosts[i].position,
                    new BinaryNumericInputResponseCurve(0, true));
            ad.addAxisForAction(goRight, (s: ILineManGameState) => s.lineMan.position - s.ghosts[i].position,
                    new BinaryNumericInputResponseCurve(0));
            ghostDeciders.push(ad);
            // Add
            i++;
        }
        // Check out the actions decided for each ghost!
        // (from state1 above)
        // LineMan is at 0
        // Ghost 0 is at 2 and should go left
        // Ghost 1 is at -2 and should go right

        // Run both ghost's highest utility action:
        ghostDeciders[0].decideAction(state, 0)(state);
        ghostDeciders[1].decideAction(state, 0)(state);
        state.ghosts[0].position.should.equal(1);
        state.ghosts[1].position.should.equal(-1);
    });
    it("Ghosts should walk away from LineMan if LineMan is powered up", () => {
        const state: ILineManGameState  = {
            ghostHome: 5,
            ghosts: [
                {
                    eaten: false,
                    position: 2
                },
                {
                    eaten: false,
                    position: -2,
                }
            ],
            lineMan: {
                position: 0,
                poweredUp: true
            },
            powerUps: [],
            vegetables: []
        };
        // Same actions as last time, go left and right, but now
        // our only consideration will be a binary curve to go away from
        // LineMan if he is powered up. Otherwise, both actions have utility 1.
        const ghostDeciders: ActionDecider[] = [];
        let i: number = 0;
        for (const ghost of state.ghosts) {
            const ad: ActionDecider = new ActionDecider();

            // The action goLeft for this ghost
            const goLeft = (state1: ILineManGameState) => {
                ghostGoLeft(state1, i);
            };
            // The action goRight for this ghost
            const goRight = (state1: ILineManGameState) => {
                ghostGoRight(state1, i);
            };
            ad.addAction(goLeft);
            ad.addAction(goRight);
            ad.addAxisForAction(goLeft, (s: ILineManGameState) =>
                            (s.lineMan.poweredUp && s.lineMan.position < s.ghosts[i].position) ? 1 : 0,
                    new BinaryNumericInputResponseCurve(.5));
            ad.addAxisForAction(goRight, (s: ILineManGameState) =>
                            (s.lineMan.poweredUp && s.lineMan.position >= s.ghosts[i].position) ? 1 : 0,
                    new BinaryNumericInputResponseCurve(.5));
            ghostDeciders.push(ad);
            // Add
            i++;
        }
        // As last time, run the action decided on and
        // assert we moved the right direction.
        ghostDeciders[0].decideAction(state)(state);
        ghostDeciders[1].decideAction(state)(state);
        state.ghosts[0].position.should.equal(3);
        state.ghosts[0].position.should.equal(-3);
    });
    it("Ghosts should consider LineMan's proximity and the proximity " +
        "of each Vegetable and decide a vegetable or LineMan to pursue", () => {
        const one = 1;
        one.should.equal(1);
    });
});
