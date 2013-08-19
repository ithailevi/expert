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

   it("can be serialized to json",function() {
      var domain = expert.Domain();
      var mammal = domain.Concept.create({id:"mammal"}),
          dog = domain.Concept.create({id:"dog"}),
          elephant = domain.Concept.create({id:"elephant"}),
          smallerThan = domain.Relation.create({id: "smallerThan",
                                                isTransitive: true}),
          biggerThan = domain.Relation.create({id:"biggerThan",
                                               isTransitive:true,
                                               inverseFor:smallerThan});
      dog.isa(mammal);
      elephant.isa(mammal);
      dog.smallerThan(elephant);
      domain.serialize();
   });
});


