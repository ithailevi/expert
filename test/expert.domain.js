var assert = require("assert");
var expert = require("../lib/expert.js");

describe("Domain",function() {

   it("can be created",function() {
      var domain = expert.Domain();
      assert(domain);
   });

   it("has all public interface functions", function() {
      var domain = expert.Domain();
      assert(domain.Relation.create);
      assert(domain.Relation.fetch);
      assert(domain.Concept.create);
      assert(domain.Concept.fetch);
      assert(domain.Fact.establish);
   });

});


