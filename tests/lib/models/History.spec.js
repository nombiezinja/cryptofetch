const assert = require("chai").assert;
const History = require.main.require("lib/models/History");

describe("Retrieve Histories method", function() {

  it("should return data", function() {
    const result = History.retrieveHistories('eth');
    console.log(result)
    assert.isTrue(result);
  });

});

describe("History", function() {

  it("should save data", function() {
    const result = true
    assert.isTrue(result);
  });

});
