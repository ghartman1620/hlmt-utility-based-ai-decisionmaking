// This abstract class implementation brought to you
// by our friends at StackOverflow:
// https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes

export class AbstractResponseCurve {
    protected min: number;
    protected max: number;
    protected slope: number;
    constructor(min: number, max: number, slope: number = 1) {
        if (new.target === AbstractResponseCurve) {
            throw new TypeError("Cannot instantiate instance of AbstractResponseCurve");
        }
        this.min = min;
        this.max = max;
        this.slope = slope;
    }
    public evaluate(input: number): number {
        throw new TypeError("Evaluate not implemented for AbstractResponseCurve. " +
                "Override this method in your subclass of AbstractResponseCurve.");
    }
}

export class LinearResponseCurve extends AbstractResponseCurve {
    private yIntercept: number;
    constructor(min: number, max: number,
                slope: number = 1,
                yIntercept: number = 0) {
        super(min, max, slope);
        this.yIntercept = yIntercept;
    }
}
export class QuadraticResponseCurve extends AbstractResponseCurve {
    private xIntercept: number;
    private yIntercept: number;
    constructor(min: number, max: number,
                slope: number = 1,
                xIntercept: number = 0,
                yIntercept: number = 0) {
        super(min, max, slope);
        this.xIntercept = xIntercept;
        this.yIntercept = yIntercept;
    }
}
export class LogisticResponseCurve extends AbstractResponseCurve {}

export class LogitResponseCurve extends AbstractResponseCurve {}
