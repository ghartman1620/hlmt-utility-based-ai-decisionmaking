import { should } from "chai";
import "mocha";
import {
    AbstractResponseCurve,
    LinearResponseCurve,
    LogisticResponseCurve,
    LogitResponseCurve,
    QuadraticResponseCurve
} from "../src/response-curve";
should();

describe("Response Curves", () => {
    let curve: AbstractResponseCurve;
    it("Should throw an error when an AbstractResponseCurve is constructed", () => {
        // A function that constructs an ARC
        (() => {
            const arc: AbstractResponseCurve = new AbstractResponseCurve(0, 1);
        }).should.throw(TypeError);
    });
    it("Should not throw an error when a LinearResponseCurve is constructed", () => {
        curve = new LinearResponseCurve(0, 1);
    });
    it("Should not throw an error when a QuadraticResponseCurve is constructed", () => {
        curve = new QuadraticResponseCurve(0, 1);
    });
    it("Should not throw an error when a LogisticResponseCurve is constructed", () => {
        curve = new LogisticResponseCurve(0, 1);
    });
    it("Should not throw an error when a LogitResponseCurve is constructed", () => {
        curve = new LogitResponseCurve(0, 1);
    });
});
describe("LinearResponseCurve", () => {
    let curve: AbstractResponseCurve;
    // Simple linear curve. 0-100. Should do pretty much what we expect.
    it("Should have default slope of 1, x intercept of 0, y intercept of 0", () => {
        curve = new LinearResponseCurve(0, 100);
        curve.evaluate(0).should.equal(0);
        curve.evaluate(100).should.equal(1);
        curve.evaluate(50).should.equal(.5);
    });
    // Slope of -1, should be the reverse of the above curve.
    it("Should yield a decreasing curve with negative slope", () => {
        curve = new LinearResponseCurve(0, 100, -1, 1);
        curve.evaluate(0).should.equal(1);
        curve.evaluate(100).should.equal(0);
        curve.evaluate(50).should.equal(.5);
    });
    // Now let's set the y intercept a bit higher, with the same slope.
    // We expect the linear curve should flatten out when it starts outputting 1, and
    // that input values beyond the curve reaching an output 1 should just continue being 1.
    it("Should cap outputs at 1 even if the y intercept and slope have", () => {
        curve = new LinearResponseCurve(0, 100, 1, .5);
        curve.evaluate(0).should.equal(.5);
        curve.evaluate(100).should.equal(1);
        curve.evaluate(50).should.equal(1);
    });
    it("Should evaluate input values beyond the minimum and maximum to be equal to the min and max", () => {
        curve = new LinearResponseCurve(0, 100);
        curve.evaluate(0).should.equal(curve.evaluate(-1));
        curve.evaluate(100).should.equal(curve.evaluate(101));
        curve.evaluate(1245626787).should.equal(curve.evaluate(100));
    });
    it("Should work with non-1 values of slope and y intercept", () => {
        curve = new LinearResponseCurve(0, 100, 2, .1);
        curve.evaluate(0).should.equal(.1);
        curve.evaluate(10).should.equal(.3);
        curve.evaluate(45).should.equal(1);
        curve.evaluate(100).should.equal(1);
    });
    it("Should allow smaller, non-divisible by 100 min and max ranges", () => {
        curve = new LinearResponseCurve(-36, -14);
        curve.evaluate(-36).should.equal(0);
        curve.evaluate(-14).should.equal(1);
        curve.evaluate(-25).should.equal(.5);
    });
});

describe("QuadraticResponseCurve", () => {
    let curve: AbstractResponseCurve;
    it("Should have default slope of 1, x intercept of 0, y intercept of 0", () => {
        curve = new QuadraticResponseCurve(0, 100);
        curve.evaluate(0).should.equal(0);
        curve.evaluate(25).should.equal(.0625);
        curve.evaluate(50).should.equal(.25);
        curve.evaluate(75).should.equal(.5625);
        curve.evaluate(100).should.equal(1);
    });
    it("Should cap outputs at 1 even if the y intercept and slope have", () => {
        curve = new QuadraticResponseCurve(0, 100, 1, 0, .5);
        curve.evaluate(0).should.equal(.5);
        curve.evaluate(100).should.equal(1);
        curve.evaluate(71).should.equal(1);
    });
    it("Should evaluate input values beyond the minimum and maximum to be equal to the min and max", () => {
        curve = new QuadraticResponseCurve(0, 100);
        curve.evaluate(0).should.equal(curve.evaluate(-1));
        curve.evaluate(100).should.equal(curve.evaluate(101));
        curve.evaluate(1245626787).should.equal(curve.evaluate(100));
    });
    it("Should yield a concave up, increasing curve with positive slope and 0 x intercept", () => {
        curve = new QuadraticResponseCurve(0, 100, 2, 0, .1);
        curve.evaluate(0).should.equal(.1);
        curve.evaluate(67.3).should.equal(1);
        curve.evaluate(100).should.equal(1);
    });
    it("Should yield a concave up, decreasing curve with x intercept of 1", () => {
        curve = new QuadraticResponseCurve(0, 100, 1, 1, 0);
        curve.evaluate(0).should.equal(1);
        curve.evaluate(25).should.equal(.5625);
        curve.evaluate(50).should.equal(.25);
        curve.evaluate(75).should.equal(.0625);
        curve.evaluate(100).should.equal(0);
    });
    it("Should yield a concave down, increasing curve with x and y intercepts of 1 and -1 slope", () => {
        curve = new QuadraticResponseCurve(0, 100, -1, 1, 1);
        curve.evaluate(0).should.equal(0);
        curve.evaluate(25).should.equal(.4375);
        curve.evaluate(50).should.equal(.75);
        curve.evaluate(75).should.equal(.9375);
        curve.evaluate(100).should.equal(1);
    });
    it("Should yield a concave down, decreasing curve with y intercept 1, x intercept 0, and -1 slope", () => {
        curve = new QuadraticResponseCurve(0, 100, -1, 0, 1);
        curve.evaluate(0).should.equal(1);
        curve.evaluate(25).should.equal(.9375);
        curve.evaluate(50).should.equal(.75);
        curve.evaluate(75).should.equal(.4375);
        curve.evaluate(100).should.equal(0);
    });
    it("Should allow non-divisible by 100 ranges", () => {
        curve = new QuadraticResponseCurve(-36, 11);
        curve.evaluate(2.4).should.be.closeTo(.6675, .001);
    });
});

describe("Logistic Response Curve", () => {
    let curve: AbstractResponseCurve;

    it("Should be a curve that has low slope near minimum and maximum endpoints and high slope near the center", () => {
        curve = new LogisticResponseCurve(0, 100);
        curve.evaluate(0).should.be.closeTo(0, .01);
        curve.evaluate(25).should.be.closeTo(.076, .01);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(75).should.be.closeTo(.924, .01);
        curve.evaluate(1).should.be.closeTo(1, .01);
    });
    it("Should be decreasing with the same inflection at .5 when slope is 10", () => {
        curve = new LogisticResponseCurve(0, 100, 10);
        curve.evaluate(0).should.be.closeTo(1, .01);
        curve.evaluate(25).should.be.closeTo(.924, .001);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(75).should.be.closeTo(.076, .001);
        curve.evaluate(100).should.be.closeTo(0, .01);
    });
    it("Should have endpoint values of more than 0 and less than 1 when slope is less than 10", () => {
        curve = new LogisticResponseCurve(0, 100, 5);
        curve.evaluate(0).should.be.closeTo(.924, .001);
        curve.evaluate(25).should.be.closeTo(.777, .001);
        curve.evaluate(50).should.be.closeTo(.5, .001);
        curve.evaluate(75).should.be.closeTo(.222, .001);
        curve.evaluate(1).should.be.closeTo(.076, .001);
    });
    it("Should reach minimum and maximum before the range bounds when slope is more than 10", () => {
        curve = new LogisticResponseCurve(0, 100, 15);
        curve.evaluate(0).should.be.closeTo(1, .001);
        curve.evaluate(25).should.be.closeTo(1, .001);
        curve.evaluate(50).should.be.closeTo(.5, .001);
        curve.evaluate(75).should.be.closeTo(0, .001);
        curve.evaluate(1).should.be.closeTo(0, .001);
    });
    it("Should clamp inputs beyond min and max", () => {
        curve = new LogisticResponseCurve(0, 100);
        curve.evaluate(-1).should.equal(curve.evaluate(0));
        curve.evaluate(101).should.equal(curve.evaluate(100));
    });
    it("Should allow non-divisible by 100 ranges", () => {
        curve = new LogisticResponseCurve(-101, 435);
        curve.evaluate(362).should.be.closeTo(.974, .01);
    });
});
describe("Logit Response Curve", () => {
    let curve: AbstractResponseCurve;
    it("Should be a curve that has high slope near the minimum and maximum and low slope near the median", () => {
        curve = new LogitResponseCurve(0, 100);
        curve.evaluate(0).should.be.closeTo(0, .01);
        curve.evaluate(25).should.be.closeTo(.412, .01);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(75).should.be.closeTo(.588, .01);
        curve.evaluate(100).should.be.closeTo(1, .01);
    });
    it("Should be decreasing and have the concavity flipped with negative slope", () => {
        curve = new LogitResponseCurve(0, 100, -0.083);
        curve.evaluate(0).should.be.closeTo(1, .01);
        curve.evaluate(25).should.be.closeTo(.588, .01);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(75).should.be.closeTo(.412, .01);
        curve.evaluate(100).should.be.closeTo(0, .01);
    });
    it("Should reach 0 and 1 closer to the median with a larger slope", () => {
        curve = new LogitResponseCurve(0, 100, .3);
        curve.evaluate(0).should.be.closeTo(0, .01);
        curve.evaluate(15.5).should.be.closeTo(0, .01);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(84.5).should.be.closeTo(0, .01);
        curve.evaluate(100).should.be.closeTo(1, .01);
    });
    it("Should have even higher slope near the min and maximum but " +
       "have lower slope across the median with higher slope input", () => {
        curve = new LogitResponseCurve(0, 100, .04);
        curve.evaluate(0).should.be.closeTo(0, .01);
        curve.evaluate(1).should.be.closeTo(.316, .01);
        curve.evaluate(50).should.be.closeTo(.5, .01);
        curve.evaluate(99).should.be.closeTo(.684, .01);
        curve.evaluate(100).should.be.closeTo(1, .01);
    });
    it("Should clamp inputs beyond min and max", () => {
        curve = new LogitResponseCurve(0, 100);
        curve.evaluate(-1).should.equal(curve.evaluate(0));
        curve.evaluate(101).should.equal(curve.evaluate(100));
    });
    it("Should allow non-divisible by 100 ranges", () => {
        curve = new LogitResponseCurve(-3, 5.5);
        curve.evaluate(2.1).should.be.closeTo(.532, .01);
    });
});
