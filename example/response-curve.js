// This abstract class implementation brought to you
// by our friends at StackOverflow:
// https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var getNormalizeFunction = function (min, max) {
    var fn = function (input) {
        return input < min ? 0 : (input > max ? 1 : (input - min) / (max - min));
    };
    return fn;
};
/**
 * Clamps i between 0 and 1.
 * @param i Number to be clamped
 * i, if i is between 0 and 1 inclusive, otherwise 0 or 1 if i is too small or large respectively.
 */
var zeroToOneNormalize = function (i) {
    return i < 0 ? 0 : (i > 1 ? 1 : i);
};
var AbstractResponseCurve = (function () {
    /**
     * Construct an abstract response curve. If attempting to instantiate
     * an instance of AbstractResponseCurve, throw a TypeError.
     * Otherwise, instantiate protected variables for use in subclasses
     * @param min minimum input value of this response curve (lower values behave as this)
     * @param max maximum input value of this response curve (greater values behave as this)
     * @param slope multiplier of output of response curve
     */
    function AbstractResponseCurve(min, max, slope) {
        if (slope === void 0) { slope = 1; }
        if (new .target === AbstractResponseCurve) {
            throw new TypeError("Cannot instantiate instance of AbstractResponseCurve");
        }
        this.min = min;
        this.max = max;
        this.slope = slope;
        this.normalize = getNormalizeFunction(min, max);
    }
    /**
     * Evaluates this response curve, giving an output between 0 and 1.
     * Subclasses must override this method or an error shall be thrown.
     * @param input The input to evaluate the response curve for.
     *              If less than min or more than max, clamped to those values.
     * @returns a value between 0 and 1, inclusive
     */
    AbstractResponseCurve.prototype.evaluate = function (input) {
        throw new TypeError("Evaluate not implemented for AbstractResponseCurve. " +
            "Override this method in your subclass of AbstractResponseCurve.");
    };
    return AbstractResponseCurve;
}());
var LinearResponseCurve = (function (_super) {
    __extends(LinearResponseCurve, _super);
    /**
     * Creates a Linear Response Curve
     * @param min Minimum input value
     * @param max Maximum input value
     * @param slope Slope of this curve: m in y = mx + b
     * @param yIntercept Y intercept of this curve: b in y = mx + b
     */
    function LinearResponseCurve(min, max, slope, yIntercept) {
        if (slope === void 0) { slope = 1; }
        if (yIntercept === void 0) { yIntercept = 0; }
        var _this = _super.call(this, min, max, slope) || this;
        _this.yIntercept = yIntercept;
        return _this;
    }
    /**
     * Evalutes this linear response curve for the given input.
     * Uses the linear y = mx + b formula.
     * @param input the input value to evaluate this curve for.
     *              If less than min or more than maxed, clamped to those values.
     * @returns utility value from 0 to 1, inclusive
     */
    LinearResponseCurve.prototype.evaluate = function (input) {
        var normalizedInput = this.normalize(input);
        // y = mx + b
        var output = this.slope * normalizedInput + this.yIntercept;
        // nothing more than 1 or less than 0
        return zeroToOneNormalize(output);
    };
    return LinearResponseCurve;
}(AbstractResponseCurve));
var QuadraticResponseCurve = (function (_super) {
    __extends(QuadraticResponseCurve, _super);
    /**
     * Creats a Quadratic Response Curve using the formula
     * @param min Minimum input value
     * @param max Maximum input value
     * @param slope slope of the curve - m in the curve formula
     * @param xIntercept point at which the curve reaches its absolute minimum or maximum - c in the formula
     * @param yIntercept offset from 0 of the minimum or maximum point of the curve - b in the formula
     */
    function QuadraticResponseCurve(min, max, slope, xIntercept, yIntercept) {
        if (slope === void 0) { slope = 1; }
        if (xIntercept === void 0) { xIntercept = 0; }
        if (yIntercept === void 0) { yIntercept = 0; }
        var _this = _super.call(this, min, max, slope) || this;
        _this.xIntercept = xIntercept;
        _this.yIntercept = yIntercept;
        return _this;
    }
    /**
     * Evalutes this quadratic reponse curve.
     * Uses the quadratic formula (b + m * (x-c)^2)
     * @param input the input value to evaluate this curve for.
     *              If less than min or more than maxed, clamped to those values.
     * @returns utility value from 0 to 1, inclusive
     */
    QuadraticResponseCurve.prototype.evaluate = function (input) {
        var normalizedInput = this.normalize(input);
        // b + m * (x - c) ^ 2
        var output = this.yIntercept + this.slope * Math.pow((normalizedInput - this.xIntercept), 2);
        return zeroToOneNormalize(output);
    };
    return QuadraticResponseCurve;
}(AbstractResponseCurve));
var LogisticResponseCurve = (function (_super) {
    __extends(LogisticResponseCurve, _super);
    /**
     * Creates a LogisticResponseCurve.
     * Uses the formula y = 1/(1+e^(m * (x - .5)))
     * @param min Min input value
     * @param max Max input value
     * @param slope Multiplier of the exponent in the logistic response curve, m. Default -10
     */
    function LogisticResponseCurve(min, max, slope) {
        if (slope === void 0) { slope = -10; }
        return _super.call(this, min, max, slope) || this;
    }
    /**
     * Evalutes this LogisticResponseCurve.
     * @param input input to clamp and evaluate using the Logistic formula
     * @returns utility value from 0 to 1, inclusive
     */
    LogisticResponseCurve.prototype.evaluate = function (input) {
        var normalizedInput = this.normalize(input);
        // 1/(1+e^(m * (x - .5)))
        var output = 1 / (1 + Math.pow(Math.E, this.slope * (normalizedInput - .5)));
        return zeroToOneNormalize(output);
    };
    return LogisticResponseCurve;
}(AbstractResponseCurve));
var LogitResponseCurve = (function (_super) {
    __extends(LogitResponseCurve, _super);
    /**
     * Creates a LogisticResponseCurve.
     * Uses the formula y = .5+log(x/(1-x))*m
     * @param min Min input value
     * @param max Max input value
     * @param slope Multiplier of the log in the logit response curve, m
     */
    function LogitResponseCurve(min, max, slope) {
        if (slope === void 0) { slope = .083; }
        return _super.call(this, min, max, slope) || this;
    }
    /**
     * Evaluates this LogitResopnseCurve
     * @param input input to clamp and evaluate using the Logit (inverse Logistic) formula
     * @returns utility value from 0 to 1, inclusive
     */
    LogitResponseCurve.prototype.evaluate = function (input) {
        var normalizedInput = this.normalize(input);
        // .5+log(x/(1-x))*m
        var output = .5 + Math.log(normalizedInput / (1 - normalizedInput)) * this.slope;
        return zeroToOneNormalize(output);
    };
    return LogitResponseCurve;
}(AbstractResponseCurve));
// A response curve mapping a numeric input to a binary output based on
// whether it's less than or more than the value.
var BinaryNumericInputResponseCurve = (function (_super) {
    __extends(BinaryNumericInputResponseCurve, _super);
    function BinaryNumericInputResponseCurve(breakpoint, inverted) {
        if (inverted === void 0) { inverted = false; }
        var _this = 
        // See, now this is the sort of thing you have to do if you've
        // made a bad decision. Making arbitrary superclass calls with special magic values
        // that we're just going to... ignore. Hmmmmmmmmmmmmmmmmmmmmm.
        // Perhaps we should use strategy here? How would that look?
        _super.call(this, 0, 0, 0) || this;
        _this.breakpoint = breakpoint;
        _this.inverted = inverted;
        return _this;
    }
    /**
     * Evaluate input to 0 or 1.
     * @param input number to compare against this binary numeric input response curve.
     * @returns 0 if input is less than breakpoint and the curve is not inverted
     *          1 if input is greater or equal breakpoint and the curve is not inverted
     *          1 if input is less than breakpoint and the curve is inverted
     *          0 if input is greater or equal breakpoint and the curve is inverted
     */
    BinaryNumericInputResponseCurve.prototype.evaluate = function (input) {
        return this.inverted ? ((input >= this.breakpoint) ? 0 : 1) : ((input < this.breakpoint) ? 0 : 1);
    };
    return BinaryNumericInputResponseCurve;
}(AbstractResponseCurve));
