/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('joblint', function () {
    var createLinter, joblint, rules;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });

        createLinter = require('../mock/linter');
        mockery.registerMock('./linter', createLinter);

        rules = {
            example: sinon.spy()
        };
        mockery.registerMock('../rule/example', rules.example);

        joblint = require('../../lib/joblint');
    });

    afterEach(function () {
        mockery.disable();
    });

    it('should be a function', function () {
        assert.isFunction(joblint);
    });

    describe('.call()', function () {
        var linter, result;

        beforeEach(function () {
            result = joblint('foo');
            linter = createLinter.firstCall.returnValue;
        });

        it('should create a linter', function () {
            assert.strictEqual(createLinter.callCount, 1);
        });

        it('should load the rules and call with the linter', function () {
            assert.strictEqual(rules.example.withArgs(linter).callCount, 1);
        });

        it('should lint the passed in body text with the linter', function () {
            assert.strictEqual(linter.lint.withArgs('foo').callCount, 1);
        });

        it('should return the result of the lint', function () {
            assert.strictEqual(result, linter.mockResult);
        });

    });

});
