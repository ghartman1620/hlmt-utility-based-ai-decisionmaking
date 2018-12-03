// This abstract class implementation brought to you
// by our friends at StackOverflow:
// https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes

/**
 * Given min and max bookends for a range,
 * return a function that, given some value, will normalize it between 0 and 1, inclusive.
 * If the given value is outside the range it will treat it as the minimum or maximum value
 * in the range as appropriate.
 */
type NormalizeFunction = (i: number) => number;
const getNormalizeFunction = (min: number, max: number): NormalizeFunction => {
    const fn: NormalizeFunction = (input: number) => {
        return input < min ? 0 : (input > max ? 1 : (input - min) / (max - min));
    };
    return fn;
};

/**
 * Clamps i between 0 and 1.
 * @param i Number to be clamped
 * i, if i is between 0 and 1 inclusive, otherwise 0 or 1 if i is too small or large respectively.
 */
const zeroToOneNormalize = (i: number): number => {
    return i < 0 ? 0 : (i > 1 ? 1 : i);
};

export class AbstractResponseCurve {
    protected min: number;
    protected max: number;
    protected slope: number;
    protected normalize: NormalizeFunction;
    /**
     * Construct an abstract response curve. If attempting to instantiate
     * an instance of AbstractResponseCurve, throw a TypeError.
     * Otherwise, instantiate protected variables for use in subclasses
     * @param min minimum input value of this response curve (lower values behave as this)
     * @param max maximum input value of this response curve (greater values behave as this)
     * @param slope multiplier of output of response curve
     */
    constructor(min: number, max: number, slope: number = 1) {
        if (new.target === AbstractResponseCurve) {
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
    public evaluate(input: number): number {
        throw new TypeError("Evaluate not implemented for AbstractResponseCurve. " +
                "Override this method in your subclass of AbstractResponseCurve.");
    }
}

export class LinearResponseCurve extends AbstractResponseCurve {
    private yIntercept: number;
    /**
     * Creates a Linear Response Curve
     * @param min Minimum input value
     * @param max Maximum input value
     * @param slope Slope of this curve: m in y = mx + b
     * @param yIntercept Y intercept of this curve: b in y = mx + b
     */
    constructor(min: number, max: number,
                slope: number = 1,
                yIntercept: number = 0) {
        super(min, max, slope);
        this.yIntercept = yIntercept;
    }
    /**
     * Evalutes this linear response curve for the given input.
     * Uses the linear y = mx + b formula.
     * @param input the input value to evaluate this curve for.
     *              If less than min or more than maxed, clamped to those values.
     * @returns utility value from 0 to 1, inclusive
     */
    public evaluate(input: number): number {
        const normalizedInput: number = this.normalize(input);
        // y = mx + b
        const output: number = this.slope * normalizedInput + this.yIntercept;
        // nothing more than 1 or less than 0
        return zeroToOneNormalize(output);
    }
}
export class QuadraticResponseCurve extends AbstractResponseCurve {
    private xIntercept: number;
    private yIntercept: number;
    /**
     * Creats a Quadratic Response Curve using the formula
     * @param min Minimum input value
     * @param max Maximum input value
     * @param slope slope of the curve - m in the curve formula
     * @param xIntercept point at which the curve reaches its absolute minimum or maximum - c in the formula
     * @param yIntercept offset from 0 of the minimum or maximum point of the curve - b in the formula
     */
    constructor(min: number, max: number,
                slope: number = 1,
                xIntercept: number = 0,
                yIntercept: number = 0) {
        super(min, max, slope);
        this.xIntercept = xIntercept;
        this.yIntercept = yIntercept;
    }
    /**
     * Evalutes this quadratic reponse curve.
     * Uses the quadratic formula (b + m * (x-c)^2)
     * @param input the input value to evaluate this curve for.
     *              If less than min or more than maxed, clamped to those values.
     * @returns utility value from 0 to 1, inclusive
     */
    public evaluate(input: number): number {
        const normalizedInput: number = this.normalize(input);
        // b + m * (x - c) ^ 2
        const output = this.yIntercept + this.slope * Math.pow((normalizedInput - this.xIntercept), 2);
        return zeroToOneNormalize(output);
    }
}
export class LogisticResponseCurve extends AbstractResponseCurve {
    /**
     * Creates a LogisticResponseCurve.
     * Uses the formula y = 1/(1+e^(m * (x - .5)))
     * @param min Min input value
     * @param max Max input value
     * @param slope Multiplier of the exponent in the logistic response curve, m. Default -10
     */
    constructor(min: number, max: number, slope: number = -10) {
        super(min, max, slope);
    }

    /**
     * Evalutes this LogisticResponseCurve.
     * @param input input to clamp and evaluate using the Logistic formula
     * @returns utility value from 0 to 1, inclusive
     */
    public evaluate(input: number): number {
        const normalizedInput: number = this.normalize(input);
        // 1/(1+e^(m * (x - .5)))
        const output = 1 / (1 + Math.pow(Math.E, this.slope * (normalizedInput - .5)));
        return zeroToOneNormalize(output);
    }
}

export class LogitResponseCurve extends AbstractResponseCurve {
    /**
     * Creates a LogisticResponseCurve.
     * Uses the formula y = .5+log(x/(1-x))*m
     * @param min Min input value
     * @param max Max input value
     * @param slope Multiplier of the log in the logit response curve, m
     */
    constructor(min: number, max: number, slope: number = .083) {
        super(min, max, slope);
    }
    /**
     * Evaluates this LogitResopnseCurve
     * @param input input to clamp and evaluate using the Logit (inverse Logistic) formula
     * @returns utility value from 0 to 1, inclusive
     */
    public evaluate(input: number): number {
        const normalizedInput: number = this.normalize(input);
        // .5+log(x/(1-x))*m
        const output = .5 + Math.log(normalizedInput / (1 - normalizedInput)) * this.slope;
        return zeroToOneNormalize(output);
    }
}
// A response curve mapping a numeric input to a binary output based on
// whether it's less than or more than the value.
export class BinaryNumericInputResponseCurve extends AbstractResponseCurve {
    private breakpoint: number;
    private inverted: boolean;
    constructor(breakpoint: number, inverted: boolean = false) {
        // See, now this is the sort of thing you have to do if you've
        // made a bad decision. Making arbitrary superclass calls with special magic values
        // that we're just going to... ignore. Hmmmmmmmmmmmmmmmmmmmmm.
        // Perhaps we should use strategy here? How would that look?
        super(0, 0, 0);
        this.breakpoint = breakpoint;
        this.inverted = inverted;
    }
    /**
     * Evaluate input to 0 or 1.
     * @param input number to compare against this binary numeric input response curve.
     * @returns 0 if input is less than breakpoint and the curve is not inverted
     *          1 if input is greater or equal breakpoint and the curve is not inverted
     *          1 if input is less than breakpoint and the curve is inverted
     *          0 if input is greater or equal breakpoint and the curve is inverted
     */
    public evaluate(input: number): number {
        return this.inverted ? ((input >= this.breakpoint) ? 0 : 1) : ((input < this.breakpoint) ? 0 : 1);
    }
}
