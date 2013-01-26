var assert = require("assert");
var expert = require("../lib/expert.js");

describe("Fact",function() {
   var domain = expert.Domain();

   it ("can be established using a standalone relation", function() {
      var dog = domain.Concept.create(),
          mammal = domain.Concept.create(),
          isa = domain.isa;

     domain.Fact.establish( dog, isa, mammal );
     assert( domain.example(mammal, dog) );
   });

});


