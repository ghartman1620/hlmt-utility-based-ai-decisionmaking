"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Construct an axis.
 * @param axisFunction Function that is a TargetFunction, meaning it takes in the state
 * and returns a number based on the state.
 * @param curve The current response curve that is passed in as a parameter.
 */
var Axis = (function () {
    function Axis(axisFunction, curve) {
        this.axisFunction = axisFunction;
        this.curve = curve;
    }
    return Axis;
}());
console.log("Hello from action decider");
var AbstractAction = (function () {
    function AbstractAction() {
        if (new .target === AbstractAction) {
            throw new Error("No abstract actions constructed");
        }
        this.targetedAxes = [];
        this.axes = [];
    }
    AbstractAction.prototype.addAxis = function (axis) {
        this.axes.push(axis);
    };
    AbstractAction.prototype.addTargetedAxis = function (axis) {
        this.targetedAxes.push(axis);
    };
    AbstractAction.prototype.getUtilities = function (state) {
        throw new Error("override me");
    };
    return AbstractAction;
}());
var TargetedAction = (function (_super) {
    __extends(TargetedAction, _super);
    function TargetedAction(targetedAction, targetFunction) {
        var _this = _super.call(this) || this;
        _this.targetedAction = targetedAction;
        _this.targetFunction = targetFunction;
        return _this;
    }
    TargetedAction.prototype.getUtilities = function (state) {
        var _this = this;
        var utilitiesTotal = 1;
        var utilityActions = [];
        for (var _i = 0, _a = this.axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            utilitiesTotal *= axis.curve.evaluate(axis.axisFunction(state));
        }
        var _loop_1 = function (target) {
            var targetSelectedAction = function (s) {
                _this.targetedAction(s, target);
            };
            var targetUtilityTotal = 1;
            for (var _i = 0, _a = this_1.targetedAxes; _i < _a.length; _i++) {
                var axis = _a[_i];
                targetUtilityTotal *= axis.curve.evaluate(axis.axisFunction(state, target));
            }
            var totalUtility = 1;
            totalUtility *= targetUtilityTotal;
            totalUtility *= utilitiesTotal;
            utilityActions.push({ value: totalUtility, action: targetSelectedAction });
        };
        var this_1 = this;
        for (var _b = 0, _c = this.targetFunction(state); _b < _c.length; _b++) {
            var target = _c[_b];
            _loop_1(target);
        }
        return utilityActions;
    };
    return TargetedAction;
}(AbstractAction));
var UntargetedAction = (function (_super) {
    __extends(UntargetedAction, _super);
    function UntargetedAction(untargetedAction, axisList) {
        var _this = _super.call(this) || this;
        _this.untargetedAction = untargetedAction;
        return _this;
    }
    UntargetedAction.prototype.getUtilities = function (state) {
        var utilitiesTotal = 1;
        for (var _i = 0, _a = this.axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            utilitiesTotal *= axis.curve.evaluate(axis.axisFunction(state));
        }
        var ret = [{
                action: this.untargetedAction,
                value: utilitiesTotal
            }];
        return ret;
    };
    return UntargetedAction;
}(AbstractAction));
var ActionDecider = (function () {
    function ActionDecider() {
        this.actions = new Map();
    }
    /**
     * Adds an action for potential selection by this
     * ActionDecider. To be considered in
     * action selection, add an Axis
     * using addAxisForAction for this action.
     * @param action The action to be added.
     */
    ActionDecider.prototype.addAction = function (action) {
        this.actions.set(action, new UntargetedAction(action, []));
        // throw new Error("Not implemented!");
    };
    /**
     * Adds an action as with addAction, with the change
     * that targeted actions require a target function
     * to describe the potential list of targets
     * and are evaluated for each target.
     * @param action The action to be added
     * @param target A function on state returning an iterable.
     */
    ActionDecider.prototype.addTargetedAction = function (action, targets) {
        this.actions.set(action, new TargetedAction(action, targets));
    };
    /**
     * @returns List of actions added so far.
     */
    ActionDecider.prototype.getActions = function () {
        var actionArray = Array.from(this.actions.keys());
        return actionArray;
    };
    /**
     * Gets the list of axis associated with a particular action.
     * @param action The action to get axis for
     */
    ActionDecider.prototype.getAxisForAction = function (action) {
        return this.actions.get(action).axes;
    };
    /**
     * Adds an axis for an action.
     * May be targeted or untargeted.
     * @param action The action to add a consideration for.
     * @param get A function on state that returns a number.
     * @param curve A response curve to decide the utility for this consideration.
     */
    ActionDecider.prototype.addAxisForAction = function (action, get, curve) {
        var newAxis = new Axis(get, curve);
        this.actions.get(action).addAxis(newAxis);
    };
    /**
     * Add an axis for a targeted action.
     * Throws a TypeError if an action was not
     * declared as a targeted action.
     * @param action The targeted action to add a consideration for.
     * @param get A function on the thing returned by the target
     *          iterator function for this action giving a number
     * @param curve A response curve to decide the utility for this consideration.
     */
    ActionDecider.prototype.addTargetedAxisForAction = function (action, get, curve) {
        var newAxis = new Axis(get, curve);
        if (this.actions.get instanceof UntargetedAction) {
            throw new Error("Cannot add targeted axes to untargeted actions");
        }
        this.actions.get(action).addTargetedAxis(newAxis);
    };
    ActionDecider.prototype.computeUntargetedUtility = function (state, action) {
        return this.actions.get(action).getUtilities(state)[0].value;
    };
    // public computeTargetedUtilities(state: any, action: TargetedAction): IActionValue[] {
    //     for (const axis of this.actions.get(action)) { // for targeted action, calculate utility of it in all axis
    //     }
    // }
    ActionDecider.prototype.getAllActionUtilities = function (state) {
        var actionUtilities = [];
        for (var _i = 0, _a = this.actions.values(); _i < _a.length; _i++) {
            var action = _a[_i];
            actionUtilities = actionUtilities.concat(action.getUtilities(state));
        }
        return actionUtilities;
    };
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
    ActionDecider.prototype.getProbabilities = function (state) {
        // const probDistribution = new Map();
        var utilities = this.getAllActionUtilities(state);
        var utilitySum = 0;
        for (var _i = 0, utilities_1 = utilities; _i < utilities_1.length; _i++) {
            var actionUtility = utilities_1[_i];
            utilitySum += actionUtility.value;
        }
        var probabilityList = [];
        for (var _a = 0, utilities_2 = utilities; _a < utilities_2.length; _a++) {
            var actionUtility = utilities_2[_a];
            var probability = actionUtility.value / utilitySum;
            var newActionProbability = {
                action: actionUtility.action,
                value: probability
            };
            probabilityList.push(newActionProbability);
        }
        probabilityList.sort(function (a, b) {
            return b.value - a.value;
        });
        return probabilityList;
    };
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
    ActionDecider.prototype.decideAction = function (state, random) {
        if (random === void 0) { random = Math.random(); }
        if (this.actions.size === 0) {
            throw new Error("Supply at least one action before calling decideAction");
        }
        var sortedListOfActionsByProbability = this.getProbabilities(state);
        console.log(sortedListOfActionsByProbability);
        var runningSum = 0;
        for (var _i = 0, sortedListOfActionsByProbability_1 = sortedListOfActionsByProbability; _i < sortedListOfActionsByProbability_1.length; _i++) {
            var actionProbability = sortedListOfActionsByProbability_1[_i];
            runningSum += actionProbability.value;
            if (runningSum >= random) {
                return actionProbability.action;
            }
        }
        return sortedListOfActionsByProbability[0].action;
    };
    return ActionDecider;
}());
