'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var _ = require('lodash');
var Calculator = require('./calculator');

var data = fs
  .readFileSync('./tests.md', 'utf8')
  .toString()
  .split("\n");

var parseRecord = (record) => {
  var arr = record.split('|');
  return {
    input: arr[1].trim().split(' '),
    mainDisplay: arr[2].trim(),
    additionalDisplay: arr[3].trim()
  };
};

var testCases = _
  .chain(data)
  .drop(2)
  .remove((record) => record.length !== 0)
  .map(parseRecord)
  .value();

describe("Calculator", function(done) {
  testCases.forEach(function(tc) {
    it(`should work for input '${tc.input.join(' ')}'`, function() {

      var calc = new Calculator();

      tc.input.forEach(function(i) {
        calc.input(i);
      });

      expect(calc.mainDisplay()).to.eql(tc.mainDisplay, 'Main display');
      expect(calc.additionalDisplay()).to.eql(tc.additionalDisplay, 'Additional display');
    });
  });
});
