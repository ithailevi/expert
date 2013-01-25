var assert = require("assert");
var expert = require("../lib/expert.js");

describe("Relation",function() {

   var domain = expert.Domain();

   it("can be created with an Id", function() {
      var smallerThan = domain.Relation.create({id:"smallerThan"});
      assert(smallerThan.id === "smallerThan");
   });

   it("can be created without an Id", function() {
      var smallerThan = domain.Relation.create();
      assert(smallerThan.id === 0);
   });

   it("can be fetched", function() {
      var smallerThan = domain.Relation.fetch("smallerThan");
      assert(smallerThan.id === "smallerThan");
   });

   it("adds a function to Concept prototype", function() {
      var smallerThan = domain.Relation.fetch("smallerThan");
      assert(domain.Concept.create().smallerThan);
   });

   it("is not transitive by default", function() {
      var ant = domain.Concept.create({id:"ant"}),
          dog = domain.Concept.create({id:"dog"}),
          elephant = domain.Concept.create({id:"elephant"}),
          smallerThan = domain.Relation.create({id:"smallerThan"});

      ant.smallerThan(dog);
      dog.smallerThan(elephant);
      assert (smallerThan(ant, elephant) === false);
   });

   it("can be defined as transitive", function() {
      var ant = domain.Concept.create({id:"ant"}),
          dog = domain.Concept.create({id:"dog"}),
          elephant = domain.Concept.create({id:"elephant"}),
          smallerThan = domain.Relation.create({id:"smallerThan",isTransitive:true});

      ant.smallerThan(dog);
      dog.smallerThan(elephant);
      assert (smallerThan(ant, elephant) === true);
   });

   it("can have an inverse relation", function() {
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
      assert.equal(biggerThan(elephant,dog),true);
   });

   it("can imply another relation", function() {
      var wing  = domain.Concept.create(),
          plane = domain.Concept.create(),
          partOf = domain.Relation.create(),
          attachedTo = domain.Relation.create({id:"attachedTo"})
            .implies(partOf);
      wing.attachedTo(plane);
      assert(partOf(wing, plane)===true);
   });

});
