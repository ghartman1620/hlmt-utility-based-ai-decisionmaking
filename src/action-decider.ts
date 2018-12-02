import Axis from "./axis";
import { AbstractResponseCurve } from "./response-curve";
// The ActionDecider class is the general interface with which
// A game will interact with the utility decision making process.
// Check out the test cases in decision-test*.spec.ts for some
// examples of its use.
// Users can add actions. Actions are either targeted or untargeted.
// Targeted actions must be added with a function on state that
// returns a list of actions, so that function might, for example,
// return a list of enemies

// For each action, a user may supply a list of axis. Axis
// may also be either untargeted - they only act on game state,
// or untargeted - they act on a particular target.

// Users then make a decision by calling decideAction().
// Decide Action returns a function on game state. It may be the result
// of either an untargeted action - in which the function passed is
// returned unchanged, or a targeted action - in which the function
// returned is a new function that calls the targeted function passed in
// on the decided target.

// Type definitions:
// Some types for dealing with axis and actions.
// Potentially game state should be something more defined than any
// Also if anybody ever finds out the way in TypeScript to declare
// the type of something with Symbol.iterator (it can be iterated over)
// Let's add it for TargetFunction.

// An Untargeted Action is some action upon a game state that causes
// state change but does not return a value
export type UntargetedAction = (state: any) => void;

// A Targeted Action is an action that acts upon the game state
// and some particular target.
export type TargetedAction = (state: any, target: any) => void;

// An Action (as in, the internal data stored by the ActionDecider)
// Is either an UntargetedAction or the combination of a
// TargetedAction and a TargetFunction.
interface ITargetedAction {
    action: TargetedAction;
    target: TargetFunction;
}
type Action = UntargetedAction | ITargetedAction;

// An AxisFunction is a computation on a game state that causes
// no state change and returns a number
export type AxisFunction = (a: any) => number;

// A TargetFunction is a function on a state that
// returns some kind of iterable.
// I wish I could require this function to return an
// iterable, but there appears to be no way at
// compile time to confirm that something is iterable with TS.
export type TargetFunction = (a: any) => any;

// An ActionMap maps Actions to a list of Axis
export type ActionMap = Map<Action, Axis[]>;

export enum CurveType {
    Linear, Quadratic
}

export default class ActionDecider {
    private actions: ActionMap;
    constructor() {
        this.actions = new Map();
    }

    /**
     * Adds an action for potential selection by this
     * ActionDecider. To be considered in
     * action selection, add an Axis
     * using addAxisForAction for this action.
     * @param action The action to be added.
     */
    public addAction(action: UntargetedAction): void {
        throw new Error("Not implemented!");
    }
    /**
     * Adds an action as with addAction, with the change
     * that targeted actions require a target function
     * to describe the potential list of targets
     * and are evaluated for each target.
     * @param action The action to be added
     * @param target A function on state returning an iterable.
     */
    public addTargetedAction(action: TargetedAction, targets: TargetFunction): void {
        throw new Error("Not implemented!");
    }
    /**
     * @returns List of actions added so far.
     */
    public getActions(): Action[] {
        throw new Error("Not implemented!");
    }
    /**
     * Gets the list of axis associated with a particular action.
     * @param action The action to get axis for
     */
    public getAxisForAction(action: Action): Axis[] {
        throw new Error("Not implemented!");
    }
    /**
     * Adds an axis for an action.
     * May be targeted or untargeted.
     * @param action The action to add a consideration for.
     * @param get A function on state that returns a number.
     * @param curve A response curve to decide the utility for this consideration.
     */
    public addAxisForAction(action: Action, get: AxisFunction,
                            curve: AbstractResponseCurve): void {
        throw new Error("Not implemented!");
    }
    /**
     * Add an axis for a targeted action.
     * Throws a TypeError if an action was not
     * declared as a targeted action.
     * @param action The targeted action to add a consideration for.
     * @param get A function on the thing returned by the target
     *          iterator function for this action giving a number
     * @param curve A response curve to decide the utility for this consideration.
     */
    public addTargetedAxisForAction(action: Action, get: AxisFunction,
                                    curve: AbstractResponseCurve): void {
        throw new Error("Not implemented!");
    }
    /**
     * Gets weighted probabilities for each
     * Action in this ActionDecider, such that the
     * sum of all probabilities is 1.
     * Targeted actions are evaluated for each target,
     * and such
     * @param state A game state to evaluate probabilites for.
     * @returns A mapping of untargeted actions to probabilities.
     *          Targeted Actions will have an untargeted action entry
     *          with the targeted function called on each target
     *          in the map.
     */
    public getProbabilities(state: any): Map<UntargetedAction, number> {
        throw new Error("Not implemented!");
    }
    /**
     * Use getProbabilities to select an action based
     * on the weighed probabilities returned.
     * for example, if getProbabilities returned:
     * {
     *    goFarAway: .1,
     *    boilTheOcean: .9,
     * }
     * decideAction will select boilTheOcean 90% of the time
     * and goFarAway 10% of the time.
     * The optional random parameter, which defaults to Math.random
     * and should not really be overwritten for an actual use case,
     * is for testing purposes, so we can make sure that
     * something like .5 always selects a particular action.
     * @param state The game state to make a decision for.
     * @param random A number in [0, 1) to use to select an action.
     *              Defaults to Math.random().
     * @returns An action on the game state that may be called.
     *          If a targeted action is selected for a particular
     *          target, a function caling the targetedaction on the
     *          given target will be returned.
     */
    public decideAction(state: any, random: number = Math.random()): UntargetedAction {
        throw new Error("Not implemented!");
    }
}
