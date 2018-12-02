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
    it("Should throw an error when an AbstractResponseCurve is constructed", () => {
        // A function that constructs an ARC
        (() => {
            const arc: AbstractResponseCurve = new AbstractResponseCurve(0, 1);
        }).should.throw(TypeError);
    });
    it("Should not throw an error when a LinearResponseCurve is constructed", () => {
        const curve: AbstractResponseCurve = new LinearResponseCurve(0, 1);
    });
    it("Should not throw an error when a QuadraticResponseCurve is constructed", () => {
        const curve: AbstractResponseCurve = new QuadraticResponseCurve(0, 1);
    });
    it("Should not throw an error when a LogisticResponseCurve is constructed", () => {
        const curve: AbstractResponseCurve = new LogisticResponseCurve(0, 1);
    });
    it("Should not throw an error when a LogitResponseCurve is constructed", () => {
        const curve: AbstractResponseCurve = new LogitResponseCurve(0, 1);
    });
});
