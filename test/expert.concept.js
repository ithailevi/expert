var assert = require("assert");
var expert = require("../lib/expert.js");

describe("Concept",function() {

   var domain = expert.Domain();

   it("can be created with an Id",function() {
      var dog = domain.Concept.create({id:"dog"}); 
      assert(dog.id === "dog");
   });

   it("can be created without an Id",function() {
      var dog = domain.Concept.create(); 
      assert(dog.id === 0);
   });

   it("can be fetched",function() {
      var dog = domain.Concept.fetch("dog"); 
      assert(dog.id==="dog");
   });

   it("can be defined as a kind of another concept", function() {
      var mammal = domain.Concept.create({id:"mammal"}); 
      var dog = domain.Concept.create({id:"dog"}); 
      dog.isa(mammal);
      assert(domain.example(mammal).length===1);
   });

   it("can return a random linked concept by relation id", function() {
      var mammal = domain.Concept.create({id:"mammal"}); 
      var dog = domain.Concept.create({id:"dog"}),
          cat = domain.Concept.create({id:"cat"}); 
      dog.isa(mammal);
      cat.isa(mammal);

      var r = domain.$("mammal").any('example');

      assert(r === dog || r === cat);
      
   });
});
