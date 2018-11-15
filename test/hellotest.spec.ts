import { should } from "chai";
import "mocha";
import { hello } from "../src/mymodule";
should();
describe("MyModule.hello()", () => {
    it("should return a string with 13 characters", () => {
        hello().should.have.lengthOf(13);
    });
    it("should have H as the first character in the string", () => {
        hello().charAt(0).should.equal("H");
        // throw {myError:'throwing error to fail test'}
    });
    it("should return the string \'Hello world!\'", () => {
        hello().should.equal("Hello, world!");
    });
    it("should not return the string \'Not this\'", () => {
        hello().should.not.equal("Not this");
    });
});
