import { hello } from "../src/mymodule";
import { should } from "chai";
should();
import 'mocha';

describe('MyModule.hello()', function () {
    it('should return a string with 13 characters', function () {
        hello().should.have.lengthOf(13);
    });
    it('should have H as the first character in the string', function () {
        hello().charAt(0).should.equal('H');
        //throw {myError:'throwing error to fail test'}
    });
    it('should return the string \'Hello world!\'', function() {
        hello().should.equal('Hello, world!');
    });
    it('should not return the string \'Not this\'', function() {
        hello().should.not.equal('Not this');
    });
});