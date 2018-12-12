import { AbstractResponseCurve } from "./response-curve";
/**
 * Construct an axis.
 * @param axisFunction Function that is a TargetFunction, meaning it takes in the state
 * and returns a number based on the state.
 * @param curve The current response curve that is passed in as a parameter.
 */
class Axis {
    public axisFunction: AxisFunction | TargetedAxisFunction;
    public curve: AbstractResponseCurve;
    constructor(axisFunction: AxisFunction | TargetedAxisFunction,
                curve: AbstractResponseCurve) {
        this.axisFunction = axisFunction;
        this.curve = curve;
    }
}

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
export type UntargetedActionFunction = (state: any) => void;

// A Targeted Action is an action that acts upon the game state
// and some particular target.
export type TargetedActionFunction = (state: any, target: any) => void;

// An Action (as in, the internal data stored by the ActionDecider)
// Is either an UntargetedAction or the combination of a
// TargetedAction and a TargetFunction.

type ActionFunction = UntargetedActionFunction | TargetedActionFunction;

class AbstractAction {
    public axes: Axis[];
    public targetedAxes: Axis[];
    constructor() {
        if (new.target === AbstractAction) {
            throw new Error("No abstract actions constructed");
        }
        this.targetedAxes = [];
        this.axes = [];
    }
    public addAxis(axis: Axis): void {
        this.axes.push(axis);
    }
    public addTargetedAxis(axis: Axis): void {
        this.targetedAxes.push(axis);
    }
    public getUtilities(state: any): IActionValue[] {
        throw new Error("override me");
    }
}
class TargetedAction extends AbstractAction {
    public targetedAction: TargetedActionFunction;
    public targetFunction: TargetFunction;
    public constructor(targetedAction: TargetedActionFunction, targetFunction: TargetFunction) {
        super();
        this.targetedAction = targetedAction;
        this.targetFunction = targetFunction;
    }
    public getUtilities(state): IActionValue[] {
        let utilitiesTotal = 1;
        const utilityActions: IActionValue[] = [];
        for (const axis of this.axes) {
            utilitiesTotal *= axis.curve.evaluate
                ((axis.axisFunction as AxisFunction)(state));
        }
        for (const target of this.targetFunction(state)) {
            const targetSelectedAction = (s: any) => {
                this.targetedAction(s, target);
            };
            let targetUtilityTotal = 1;
            for (const axis of this.targetedAxes) {
                targetUtilityTotal *= axis.curve.evaluate
                    ((axis.axisFunction as TargetedAxisFunction)(state, target));
            }
            let totalUtility = 1;
            totalUtility *= targetUtilityTotal;
            totalUtility *= utilitiesTotal;
            utilityActions.push({value: totalUtility, action: targetSelectedAction});
        }
        return utilityActions;
    }
}
class UntargetedAction extends AbstractAction {
    public untargetedAction: UntargetedActionFunction;
    public constructor(untargetedAction: UntargetedActionFunction, axisList: Axis[]) {
        super();
        this.untargetedAction = untargetedAction;
    }
    public getUtilities(state): IActionValue[] {
        let utilitiesTotal =  1;
        for (const axis of this.axes) {
            utilitiesTotal *= axis.curve.evaluate
                ((axis.axisFunction as AxisFunction)(state));
        }
        const ret =  [{
            action: this.untargetedAction,
            value: utilitiesTotal
        }];
        return ret;
    }
}

// An AxisFunction is a computation on a game state that causes
// no state change and returns a number
export type AxisFunction = (state: any) => number;

// A TargetedAxis function has two arguments - the game state,
// and the target on which to evaluate the axis.
export type TargetedAxisFunction = (state: any, taget: any) => number;

// A TargetFunction is a function on a state that
// returns some kind of iterable.
// I wish I could require this function to return an
// iterable, but there appears to be no way at
// compile time to confirm that something is iterable with TS.
export type TargetFunction = (a: any) => Iterable<any>;

// An ActionMap maps Actions to a list of Axis
export type ActionMap = Map<AbstractAction, Axis[]>;

/**
 * Contains an action and some value.
 * That value is usually utility or probability
 */
interface IActionValue {
    action: UntargetedActionFunction;
    value: number;
}

export default class ActionDecider {
    private actions: Map<ActionFunction, AbstractAction>;
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
    public addAction(action: UntargetedActionFunction): void {
        this.actions.set(action, new UntargetedAction(action, []));
        // throw new Error("Not implemented!");
    }
    /**
     * Adds an action as with addAction, with the change
     * that targeted actions require a target function
     * to describe the potential list of targets
     * and are evaluated for each target.
     * @param action The action to be added
     * @param target A function on state returning an iterable.
     */
    public addTargetedAction(action: TargetedActionFunction, targets: TargetFunction): void {
        this.actions.set(action, new TargetedAction(action, targets));
    }
    /**
     * @returns List of actions added so far.
     */
    public getActions(): ActionFunction[] {
         const actionArray = Array.from(this.actions.keys());
         return actionArray;
    }
    /**
     * Gets the list of axis associated with a particular action.
     * @param action The action to get axis for
     */
    public getAxisForAction(action: ActionFunction): Axis[] {
        return this.actions.get(action).axes;
    }
    /**
     * Adds an axis for an action.
     * May be targeted or untargeted.
     * @param action The action to add a consideration for.
     * @param get A function on state that returns a number.
     * @param curve A response curve to decide the utility for this consideration.
     */
    public addAxisForAction(action: ActionFunction, get: AxisFunction,
                            curve: AbstractResponseCurve): void {
        const newAxis = new Axis(get, curve);
        this.actions.get(action).addAxis(newAxis);
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
    public addTargetedAxisForAction(action: ActionFunction, get: TargetedAxisFunction,
                                    curve: AbstractResponseCurve): void {
        const newAxis = new Axis(get, curve);
        if (this.actions.get instanceof UntargetedAction) {
            throw new Error("Cannot add targeted axes to untargeted actions");
        }
        this.actions.get(action).addTargetedAxis(newAxis);
    }
    public computeUntargetedUtility(state: any, action: UntargetedActionFunction): number {
        return this.actions.get(action).getUtilities(state)[0].value;
    }
    // public computeTargetedUtilities(state: any, action: TargetedAction): IActionValue[] {
    //     for (const axis of this.actions.get(action)) { // for targeted action, calculate utility of it in all axis

    //     }
    // }

    public getAllActionUtilities(state): IActionValue[] {
        let actionUtilities: IActionValue[] = [];
        for (const action of this.actions.values()) {
            actionUtilities = actionUtilities.concat(action.getUtilities(state));
        }
        return actionUtilities;
    }

    /**
     * Gets weighted probabilities for each
     * Action in this ActionDecider, such that the
     * sum of all probabilities is 1.
     * Targeted actions are evaluated for each target,
     * and such
     * @param state A game state to evaluate probabilites for.
     * @returns A sorted list of IActionValues where value = probability
     *          ordered from highest probability to lowest probability
     */
    public getProbabilities(state: any): IActionValue[] {
        // const probDistribution = new Map();
        const utilities = this.getAllActionUtilities(state);
        let utilitySum = 0;
        for (const actionUtility of utilities) {
            utilitySum += actionUtility.value;
        }
        const probabilityList = [];
        for (const actionUtility of utilities) {
            const probability = actionUtility.value / utilitySum;
            const newActionProbability: IActionValue = {
                action: actionUtility.action,
                value: probability
            };
            probabilityList.push(newActionProbability);
        }
        probabilityList.sort((a: IActionValue, b: IActionValue) =>
                b.value - a.value);
        return probabilityList;
    }
    /**
     * Uses getProbabilities to select an action based
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
     *              Will consider actions randomness in decreasing order of utility,
     *              so a random number of 0 will always select the highest utility
     *              action. This can be used to create deterministic action selection.
     * @returns An action on the game state that may be called.
     *          If a targeted action is selected for a particular
     *          target, a function caling the targetedaction on the
     *          given target will be returned.
     */
    public decideAction(state: any, random: number = Math.random()): UntargetedActionFunction {
        if (this.actions.size === 0) {
            throw new Error("Supply at least one action before calling decideAction");
        }

        const sortedListOfActionsByProbability = this.getProbabilities(state);
        console.log(sortedListOfActionsByProbability);
        let runningSum = 0;
        for (const actionProbability of sortedListOfActionsByProbability) {
            runningSum += actionProbability.value;

            if (runningSum >= random) {
                return actionProbability.action;
            }
        }
        return sortedListOfActionsByProbability[0].action;

    }
}
