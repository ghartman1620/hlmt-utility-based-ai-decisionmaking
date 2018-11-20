import Axis from "./axis";
// Some types for dealing with axis and actions. Totally subject to change
// Potentially game state should be something more defined than any

// An Action is some action upon a game state that causes
// state change but does not return a value
export type Action = (a: any) => void;

// An AxisFunction is a computation on a game state that causes
// no state change and returns a number
export type AxisFunction = (a: any) => number;

// An ActionMap maps Actions to a list of Axis
export type ActionMap = Map<Action, Axis[]>;

// We can (for now) have quadratic and linear curves. More TBA
export enum CurveType {
    Linear, Quadratic
}

export default class ActionDecider {
    private actions: ActionMap;
    constructor() {
        this.actions = new Map();
    }
    public addAction(action: Action): void {
        throw new Error("Not implemented!");
    }
    public getActions(): Action[] {
        throw new Error("Not implemented!");
    }
    public getAxisForAction(action: Action): Axis[] {
        throw new Error("Not implemented!");
    }
    /*
     * Add an axis for a particular action.
     * @param action: turns out this isn't the format for comments
     */
    public addAxisForAction(action: Action, fn: AxisFunction,
                            min: number, max: number,
                            type: CurveType, inverse: boolean): void {
        throw new Error("Not implemented!");
    }
    // Gets weighted probabilities for each
    // Action in this ActionDecider, such that the
    // sum of all probabilities is 1.
    public getProbabilities(state: any): Map<Action, number> {
        throw new Error("Not implemented!");
    }
    // Use getProbabilities to select an action based
    // on the weighed probabilities returned.
    // for example, if getProbabilities returned:
    // {
    //    goFarAway: .1,
    //    boilTheOcean: .9,
    // }
    // decideAction will select boilTheOcean 90% of the time
    // and goFarAway 10% of the time.
    // The optional random parameter, which defaults to Math.random
    // and should not really be overwritten for an actual use case,
    // is for testing purposes.
    public decideAction(state: any, random: number = Math.random()): Action {
        throw new Error("Not implemented!");
    }
}
